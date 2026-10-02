import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { access, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const buildDir = path.join(rootDir, `.dist-cli-build-${process.pid}`);
const backupDir = path.join(rootDir, `.dist-cli-backup-${process.pid}`);
const astroCli = path.join(rootDir, "node_modules", "astro", "bin", "astro.mjs");

async function build() {
	await rm(buildDir, { recursive: true, force: true });

	await new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [astroCli, "build", "--outDir", buildDir], {
			cwd: rootDir,
			stdio: "inherit"
		});
		child.once("error", reject);
		child.once("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`Astro build exited with code ${code ?? "unknown"}.`));
		});
	});

	await access(path.join(buildDir, "index.html"));

	let movedOldSite = false;
	try {
		if (existsSync(distDir)) {
			await rename(distDir, backupDir);
			movedOldSite = true;
		}
		await rename(buildDir, distDir);
	} catch (error) {
		if (movedOldSite && !existsSync(distDir)) {
			await rename(backupDir, distDir);
		}
		throw error;
	}

	if (movedOldSite) {
		await rm(backupDir, { recursive: true, force: true });
	}
}

try {
	await build();
	console.log("Build complete: dist/ replaced after successful verification.");
} catch (error) {
	console.error("Build failed; existing dist/ was left unchanged.", error);
	process.exitCode = 1;
} finally {
	await rm(buildDir, { recursive: true, force: true });
}
