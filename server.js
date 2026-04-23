import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { access, mkdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendContactEmail, validateContactPayload } from "./src/lib/contact.js";

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

function jsonResponse(status, payload) {
	return new Response(JSON.stringify(payload), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store"
		}
	});
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
		const child = spawn(command, args, {
			cwd: rootDir,
			env: process.env,
			shell: false,
			...options
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

	const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

	try {
		await mkdir(rebuildStateDir, { recursive: true });
		await rm(buildTempDir, { recursive: true, force: true });

		const result = await runCommand(npmCommand, [
			"run",
			"build:site",
			"--",
			"--outDir",
			buildTempDir
		]);

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

	if (rebuildState.running) {
		sendNodeResponse(
			nodeResponse,
			jsonResponse(202, {
				message: "Build is already running.",
				status: rebuildState
			})
		);
		return;
	}

	sendNodeResponse(
		nodeResponse,
		jsonResponse(202, {
			message: "Build started.",
			status: {
				...rebuildState,
				running: true,
				lastStatus: "running"
			}
		})
	);

	void runBuild();
}

async function handleRebuildStatus(nodeRequest, nodeResponse) {
	if (rebuildToken && getWebhookToken(nodeRequest) !== rebuildToken) {
		sendNodeResponse(nodeResponse, jsonResponse(401, { message: "Unauthorized" }));
		return;
	}

	sendNodeResponse(nodeResponse, jsonResponse(200, rebuildState));
}

const server = createServer(async (nodeRequest, nodeResponse) => {
	const requestPath = new URL(nodeRequest.url || "/", `http://${nodeRequest.headers.host || "localhost"}`).pathname;

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

await mkdir(rebuildStateDir, { recursive: true });

try {
	await access(rebuildStatusFile);
} catch {
	await persistRebuildState();
}

server.listen(port, host, () => {
	console.log(`Static site server listening on http://${host}:${port}`);
});
