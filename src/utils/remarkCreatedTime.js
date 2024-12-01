import { execSync } from "child_process";

export function remarkCreatedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    const result = execSync(
      `git log --diff-filter=A --follow --format=%cI -1 "${filepath}"`,
    );
    file.data.astro.frontmatter.createdTime =
      result.toString().trim() || Date.now();
  };
}
