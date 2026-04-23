import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { access, mkdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const distDir = path.join(rootDir, "dist");
const buildTempDir = path.join(rootDir, ".dist-build");
const rebuildStateDir = path.join(rootDir, ".runtime");
const rebuildLogFile = path.join(rebuildStateDir, "rebuild.log");
const rebuildStatusFile = path.join(rebuildStateDir, "rebuild-status.json");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const rebuildToken = process.env.REBUILD_WEBHOOK_TOKEN || "";
const rebuildDebounceMs = normalizeNonNegativeInteger(process.env.REBUILD_DEBOUNCE_MS, 60_000);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultSmtpPort = 465;
let nodemailerModule = null;
let rebuildTimer = null;
let scheduledBuildAt = null;
let lastWebhookAt = null;
let queuedAfterCurrentBuild = false;

let rebuildState = {
	running: false,
	startedAt: null,
	finishedAt: null,
	lastStatus: "idle",
	lastError: null
};

const mimeTypes = {
	".css": "text/css; charset=utf-8",
	".gif": "image/gif",
	".html": "text/html; charset=utf-8",
	".ico": "image/x-icon",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".mjs": "text/javascript; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml",
	".txt": "text/plain; charset=utf-8",
	".webp": "image/webp",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".xml": "application/xml; charset=utf-8"
};

function normalizeNonNegativeInteger(value, fallback) {
	const normalized = Number(value);

	if (!Number.isFinite(normalized) || normalized < 0) {
		return fallback;
	}

	return Math.round(normalized);
}

function jsonResponse(status, payload) {
	return new Response(JSON.stringify(payload), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store"
		}
	});
}

function logServerError(scope, error) {
	const message = error instanceof Error ? error.stack || error.message : String(error);
	console.error(`[server:${scope}] ${message}`);
}

function sendNodeResponse(nodeResponse, response) {
	nodeResponse.statusCode = response.status;

	for (const [key, value] of response.headers.entries()) {
		nodeResponse.setHeader(key, value);
	}

	response
		.text()
		.then((body) => nodeResponse.end(body))
		.catch(() => {
			nodeResponse.statusCode = 500;
			nodeResponse.end("Internal Server Error");
		});
}

async function readJsonBody(nodeRequest) {
	const chunks = [];

	for await (const chunk of nodeRequest) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	if (!chunks.length) {
		return null;
	}

	return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
}

const asBoolean = (value, fallback) => {
	if (value === undefined) return fallback;
	return value.toLowerCase() === "true";
};

function normalizeContactPayload(body) {
	const input = typeof body === "object" && body !== null ? body : {};

	return {
		firstName: typeof input.firstName === "string" ? input.firstName.trim() : "",
		lastName: typeof input.lastName === "string" ? input.lastName.trim() : "",
		phone: typeof input.phone === "string" ? input.phone.trim() : "",
		email: typeof input.email === "string" ? input.email.trim() : "",
		information: typeof input.information === "string" ? input.information.trim() : "",
		consent: input.consent === true
	};
}

function validateContactPayload(body) {
	const payload = normalizeContactPayload(body);

	if (!payload.firstName || !payload.lastName || !payload.phone || payload.phone === "+371") {
		return {
			ok: false,
			message: "Lūdzu, aizpildiet obligātos laukus."
		};
	}

	if (!payload.email) {
		return {
			ok: false,
			message: "E-pasta adrese ir obligāta."
		};
	}

	if (!emailPattern.test(payload.email)) {
		return {
			ok: false,
			message: "E-pasta adrese nav derīga."
		};
	}

	if (!payload.consent) {
		return {
			ok: false,
			message: "Nepieciešama piekrišana personas datu apstrādei."
		};
	}

	return {
		ok: true,
		payload
	};
}

async function createContactTransport() {
	const smtpHost = process.env.CONTACT_SMTP_HOST;
	const smtpPort = Number(process.env.CONTACT_SMTP_PORT ?? defaultSmtpPort);
	const smtpSecure = asBoolean(process.env.CONTACT_SMTP_SECURE, true);
	const smtpUser = process.env.CONTACT_SMTP_USER;
	const smtpPass = process.env.CONTACT_SMTP_PASS;

	if (!smtpHost || !smtpUser || !smtpPass) {
		return null;
	}

	if (!nodemailerModule) {
		try {
			const imported = await import("nodemailer");
			nodemailerModule = imported.default;
		} catch {
			return null;
		}
	}

	return nodemailerModule.createTransport({
		host: smtpHost,
		port: Number.isNaN(smtpPort) ? defaultSmtpPort : smtpPort,
		secure: smtpSecure,
		auth: {
			user: smtpUser,
			pass: smtpPass
		}
	});
}

async function sendContactEmail(payload) {
	const transporter = await createContactTransport();
	const toEmail = process.env.CONTACT_TO_EMAIL;
	const fromEmail = process.env.CONTACT_FROM_EMAIL ?? process.env.CONTACT_SMTP_USER;

	if (!transporter || !toEmail || !fromEmail) {
		throw new Error("Contact email is not configured.");
	}

	await transporter.sendMail({
		from: fromEmail,
		to: toEmail,
		replyTo: payload.email,
		subject: "Jauns pieprasījums no kontaktformas",
		text: [
			"Saņemts jauns pieprasījums no mājaslapas kontaktformas.",
			"",
			`Vārds: ${payload.firstName}`,
			`Uzvārds: ${payload.lastName}`,
			`Telefons: ${payload.phone}`,
			`E-pasts: ${payload.email}`,
			`Papildu informācija: ${payload.information || "-"}`
		].join("\n")
	});
}

function getWebhookToken(nodeRequest) {
	const authorization = nodeRequest.headers.authorization;

	if (authorization?.startsWith("Bearer ")) {
		return authorization.slice("Bearer ".length).trim();
	}

	const headerToken = nodeRequest.headers["x-rebuild-token"];
	return typeof headerToken === "string" ? headerToken.trim() : "";
}

async function persistRebuildState() {
	await mkdir(rebuildStateDir, { recursive: true });
	await writeFile(rebuildStatusFile, JSON.stringify(rebuildState, null, 2), "utf-8");
}

function runCommand(command, args, options = {}) {
	return new Promise((resolve, reject) => {
		const { env: envOverrides = {}, ...spawnOptions } = options;
		const mergedEnv = { ...process.env, ...envOverrides };
		const pathKey = Object.keys(mergedEnv).find((key) => key.toLowerCase() === "path") || "PATH";
		const nodeBinDir = path.dirname(process.execPath);
		const currentPath = typeof mergedEnv[pathKey] === "string" ? mergedEnv[pathKey] : "";
		const pathParts = currentPath.split(path.delimiter).filter(Boolean);

		if (!pathParts.includes(nodeBinDir)) {
			mergedEnv[pathKey] = currentPath
				? `${nodeBinDir}${path.delimiter}${currentPath}`
				: nodeBinDir;
		}

		const child = spawn(command, args, {
			cwd: rootDir,
			env: mergedEnv,
			shell: false,
			...spawnOptions
		});

		let stdout = "";
		let stderr = "";

		child.stdout.on("data", (chunk) => {
			stdout += chunk.toString();
		});

		child.stderr.on("data", (chunk) => {
			stderr += chunk.toString();
		});

		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) {
				resolve({ stdout, stderr });
				return;
			}

			reject(new Error(stderr || stdout || `Command exited with code ${code}`));
		});
	});
}

function getNpmCliCandidates() {
	const execDir = path.dirname(process.execPath);
	const candidates = [
		process.env.npm_execpath,
		path.join(execDir, "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
		path.join(execDir, "..", "node_modules", "npm", "bin", "npm-cli.js"),
		path.join(execDir, "node_modules", "npm", "bin", "npm-cli.js"),
		"/usr/lib/node_modules/npm/bin/npm-cli.js",
		"/usr/local/lib/node_modules/npm/bin/npm-cli.js"
	].filter(Boolean);

	const unique = [];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && !unique.includes(candidate) && existsSync(candidate)) {
			unique.push(candidate);
		}
	}

	return unique;
}

function getBuildSiteArgs(outDir) {
	return ["run", "build:site", "--", "--outDir", outDir];
}

async function runNpmBuild(outDir) {
	const primaryCommand = process.platform === "win32" ? "npm.cmd" : "npm";
	const buildArgs = getBuildSiteArgs(outDir);
	const fallbacks = getNpmCliCandidates();
	let primaryError = null;

	try {
		return await runCommand(primaryCommand, buildArgs);
	} catch (error) {
		primaryError = error;
		const message = error instanceof Error ? error.message : String(error);
		const isEnoent = /\bENOENT\b/i.test(message);

		if (!isEnoent || !fallbacks.length) {
			throw error;
		}
	}

	for (const npmCliPath of fallbacks) {
		try {
			return await runCommand(process.execPath, [npmCliPath, ...buildArgs]);
		} catch (error) {
			primaryError = error;
		}
	}

	if (primaryError instanceof Error) {
		throw primaryError;
	}

	throw new Error("Unable to execute npm build command.");
}

async function replaceDistDirectory() {
	const backupDir = path.join(rootDir, ".dist-backup");

	await rm(backupDir, { recursive: true, force: true });

	if (existsSync(distDir)) {
		await rename(distDir, backupDir);
	}

	await rename(buildTempDir, distDir);
	await rm(backupDir, { recursive: true, force: true });
}

async function runBuild() {
	if (rebuildState.running) {
		return false;
	}

	rebuildState = {
		running: true,
		startedAt: new Date().toISOString(),
		finishedAt: null,
		lastStatus: "running",
		lastError: null
	};
	await persistRebuildState();

	try {
		await mkdir(rebuildStateDir, { recursive: true });
		await rm(buildTempDir, { recursive: true, force: true });

		const result = await runNpmBuild(buildTempDir);

		await writeFile(rebuildLogFile, [result.stdout, result.stderr].filter(Boolean).join("\n"), "utf-8");
		await replaceDistDirectory();

		rebuildState = {
			running: false,
			startedAt: rebuildState.startedAt,
			finishedAt: new Date().toISOString(),
			lastStatus: "success",
			lastError: null
		};
		await persistRebuildState();
		return true;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown rebuild error";

		await writeFile(rebuildLogFile, errorMessage, "utf-8");
		await rm(buildTempDir, { recursive: true, force: true });

		rebuildState = {
			running: false,
			startedAt: rebuildState.startedAt,
			finishedAt: new Date().toISOString(),
			lastStatus: "failed",
			lastError: errorMessage
		};
		await persistRebuildState();
		return false;
	}
}

function getRebuildStatus() {
	return {
		...rebuildState,
		debounceMs: rebuildDebounceMs,
		queuedAfterCurrentBuild,
		lastWebhookAt,
		scheduledBuildAt
	};
}

function getDelayUntilNextBuild(now = Date.now()) {
	if (!lastWebhookAt) {
		return rebuildDebounceMs;
	}

	const dueAt = Date.parse(lastWebhookAt) + rebuildDebounceMs;

	if (Number.isNaN(dueAt)) {
		return rebuildDebounceMs;
	}

	return Math.max(0, dueAt - now);
}

function clearScheduledRebuild() {
	if (rebuildTimer) {
		clearTimeout(rebuildTimer);
		rebuildTimer = null;
	}

	scheduledBuildAt = null;
}

async function runBuildPipeline() {
	if (rebuildState.running) {
		queuedAfterCurrentBuild = true;
		return;
	}

	await runBuild();

	if (queuedAfterCurrentBuild) {
		queuedAfterCurrentBuild = false;
		scheduleRebuild();
	}
}

function scheduleRebuild() {
	if (rebuildState.running) {
		queuedAfterCurrentBuild = true;
		return {
			scheduled: false,
			queued: true,
			delayMs: null
		};
	}

	const delayMs = getDelayUntilNextBuild();
	clearScheduledRebuild();

	scheduledBuildAt = new Date(Date.now() + delayMs).toISOString();
	rebuildTimer = setTimeout(() => {
		clearScheduledRebuild();
		void runBuildPipeline();
	}, delayMs);

	if (typeof rebuildTimer.unref === "function") {
		rebuildTimer.unref();
	}

	return {
		scheduled: true,
		queued: false,
		delayMs
	};
}

function getAssetCacheControl(filePath) {
	return filePath.includes(`${path.sep}_astro${path.sep}`) ||
		/\.[a-f0-9]{8,}\./i.test(path.basename(filePath))
		? "public, max-age=31536000, immutable"
		: "public, max-age=300";
}

async function resolveStaticFile(requestPath) {
	const cleanPath = decodeURIComponent(requestPath.split("?")[0]);
	const normalizedPath = path.normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
	const safePath =
		normalizedPath === path.sep
			? ""
			: normalizedPath.replace(/^[/\\]+/, "");
	const candidatePath = path.join(distDir, safePath);
	const candidates = [
		candidatePath,
		path.join(candidatePath, "index.html"),
		`${candidatePath}.html`,
		path.join(distDir, "404.html")
	];

	for (const filePath of candidates) {
		try {
			const fileStats = await stat(filePath);
			if (fileStats.isFile()) {
				return filePath;
			}
		} catch {
			// Try the next candidate.
		}
	}

	return null;
}

async function handleContact(nodeRequest, nodeResponse) {
	try {
		const body = await readJsonBody(nodeRequest);
		const validation = validateContactPayload(body);

		if (!validation.ok || !validation.payload) {
			sendNodeResponse(
				nodeResponse,
				jsonResponse(400, { message: validation.message || "Neizdevās apstrādāt pieprasījumu." })
			);
			return;
		}

		await sendContactEmail(validation.payload);
		sendNodeResponse(
			nodeResponse,
			jsonResponse(200, {
				ok: true,
				message: "Paldies. Saņēmām jūsu pieprasījumu un sazināsimies 24 stundu laikā."
			})
		);
	} catch (error) {
		logServerError("contact", error);
		const message =
			error instanceof Error && error.message === "Contact email is not configured."
				? "Neizdevās nosūtīt pieprasījumu. Lūdzu, mēģiniet vēlreiz vēlāk."
				: "Neizdevās apstrādāt pieprasījumu.";

		sendNodeResponse(nodeResponse, jsonResponse(500, { message }));
	}
}

async function handleRebuild(nodeRequest, nodeResponse) {
	if (!rebuildToken) {
		sendNodeResponse(
			nodeResponse,
			jsonResponse(500, { message: "Rebuild webhook is not configured." })
		);
		return;
	}

	if (getWebhookToken(nodeRequest) !== rebuildToken) {
		sendNodeResponse(nodeResponse, jsonResponse(401, { message: "Unauthorized" }));
		return;
	}

	lastWebhookAt = new Date().toISOString();
	const scheduleResult = scheduleRebuild();
	const delaySeconds = Math.ceil((scheduleResult.delayMs ?? 0) / 1000);
	const message =
		scheduleResult.queued
			? "Build is already running. One follow-up build has been queued."
			: delaySeconds > 0
				? `Build scheduled in ${delaySeconds}s.`
				: "Build started.";

	sendNodeResponse(nodeResponse, jsonResponse(202, { message, status: getRebuildStatus() }));
}

async function handleRebuildStatus(nodeRequest, nodeResponse) {
	if (rebuildToken && getWebhookToken(nodeRequest) !== rebuildToken) {
		sendNodeResponse(nodeResponse, jsonResponse(401, { message: "Unauthorized" }));
		return;
	}

	sendNodeResponse(nodeResponse, jsonResponse(200, getRebuildStatus()));
}

const server = createServer(async (nodeRequest, nodeResponse) => {
	const requestPath = new URL(
		nodeRequest.url || "/",
		`http://${nodeRequest.headers.host || "localhost"}`
	).pathname;

	if (nodeRequest.method === "POST" && requestPath === "/api/contact") {
		await handleContact(nodeRequest, nodeResponse);
		return;
	}

	if (nodeRequest.method === "POST" && requestPath === "/api/rebuild") {
		await handleRebuild(nodeRequest, nodeResponse);
		return;
	}

	if (nodeRequest.method === "GET" && requestPath === "/api/rebuild/status") {
		await handleRebuildStatus(nodeRequest, nodeResponse);
		return;
	}

	if (!existsSync(distDir)) {
		nodeResponse.statusCode = 503;
		nodeResponse.setHeader("Content-Type", "text/plain; charset=utf-8");
		nodeResponse.end("Build output is missing. Run `npm run build` first.");
		return;
	}

	const filePath = await resolveStaticFile(requestPath === "/" ? "/index.html" : requestPath);

	if (!filePath) {
		nodeResponse.statusCode = 404;
		nodeResponse.setHeader("Content-Type", "text/plain; charset=utf-8");
		nodeResponse.end("Not Found");
		return;
	}

	const extension = path.extname(filePath).toLowerCase();
	nodeResponse.statusCode = filePath.endsWith(`${path.sep}404.html`) ? 404 : 200;
	nodeResponse.setHeader("Content-Type", mimeTypes[extension] || "application/octet-stream");
	nodeResponse.setHeader("Cache-Control", getAssetCacheControl(filePath));
	createReadStream(filePath).pipe(nodeResponse);
});

process.on("uncaughtException", (error) => {
	logServerError("uncaughtException", error);
});

process.on("unhandledRejection", (error) => {
	logServerError("unhandledRejection", error);
});

async function startServer() {
	try {
		await mkdir(rebuildStateDir, { recursive: true });

		try {
			await access(rebuildStatusFile);
		} catch {
			await persistRebuildState();
		}
	} catch (error) {
		logServerError("startup-init", error);
	}

	server.listen(port, host, () => {
		console.log(`Static site server listening on http://${host}:${port}`);
	});
}

void startServer();
