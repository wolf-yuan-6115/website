import { defineHastPlugin, type HastNode } from "satteri";

type ElementNode = Extract<HastNode, { type: "element" }>;
type ParentNode = Extract<HastNode, { children: unknown }>;

const FIGURE_CLASSES = ["mx-auto", "w-[85%]", "py-4", "md:w-[60%]"];
const CAPTION_CLASSES = ["mt-4", "text-center", "text-sm", "italic"];
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

function isImage(node: HastNode): node is ElementNode {
  return node.type === "element" && node.tagName === "img";
}

function isWhitespace(node: HastNode): boolean {
  return node.type === "text" && node.value.trim() === "";
}

function getAlt(image: ElementNode): string {
  const alt = image.properties?.alt;

  if (Array.isArray(alt)) {
    return alt.join(" ");
  }

  return typeof alt === "string" || typeof alt === "number"
    ? String(alt)
    : "";
}

function createFigure(image: ElementNode): ElementNode {
  return {
    type: "element",
    tagName: "figure",
    properties: { className: FIGURE_CLASSES },
    children: [
      structuredClone(image),
      {
        type: "element",
        tagName: "figcaption",
        properties: { className: CAPTION_CLASSES },
        children: [{ type: "text", value: getAlt(image) }],
      },
    ],
  };
}

export const imageFigures = defineHastPlugin({
  name: "image-figures",
  element: {
    filter: ["p"],
    visit(node, context) {
      const children = node.children ?? [];

      if (
        !children.some(isImage) ||
        !children.every(
          (child) => isImage(child) || isWhitespace(child),
        )
      ) {
        return;
      }

      const figures = children.filter(isImage).map(createFigure);

      if (figures.length === 1) {
        return figures[0];
      }

      context.insertBefore(node, figures);
      context.removeNode(node);
    },
  },
});

function isHeading(node: HastNode): node is ElementNode {
  return (
    node.type === "element" && HEADING_TAGS.includes(node.tagName)
  );
}

function createSection(
  rank: number,
  children: ElementNode["children"] = [],
): ElementNode {
  return {
    type: "element",
    tagName: "section",
    properties: {
      className: ["heading"],
      dataHeadingRank: rank,
    },
    children,
  };
}

function canBeSectionChild(
  node: HastNode,
): node is ElementNode["children"][number] {
  return (
    node.type !== "root" &&
    node.type !== "doctype" &&
    node.type !== "mdxjsEsm"
  );
}

function groupIntoSections(
  children: readonly HastNode[],
): HastNode[] {
  const output: HastNode[] = [];
  const sectionStack: ElementNode[] = [];

  for (const child of children) {
    if (!isHeading(child)) {
      const currentSection = sectionStack.at(-1);

      if (child.type === "root" || child.type === "doctype") {
        throw new Error("Markdown content must be an HTML fragment.");
      }

      if (currentSection && canBeSectionChild(child)) {
        currentSection.children.push(child);
      } else {
        output.push(child);
      }

      continue;
    }

    const rank = Number(child.tagName.slice(1));

    while (
      sectionStack.length > 0 &&
      rank <= Number(sectionStack.at(-1)?.properties.dataHeadingRank)
    ) {
      sectionStack.pop();
    }

    const section = createSection(rank, [child]);
    const parentSection = sectionStack.at(-1);

    if (parentSection) {
      parentSection.children.push(section);
    } else {
      output.push(section);
    }

    sectionStack.push(section);
  }

  return output;
}

const sectionizedParents = new WeakSet<object>();

export const sectionizeHeadings = defineHastPlugin({
  name: "sectionize-headings",
  element: {
    filter: HEADING_TAGS,
    visit(node, context) {
      const parent = context.parent(node) as
        | Readonly<ParentNode>
        | undefined;

      if (
        !parent ||
        parent.type !== "root" ||
        sectionizedParents.has(parent)
      ) {
        return;
      }

      sectionizedParents.add(parent);
      context.setProperty(
        parent,
        "children",
        groupIntoSections(parent.children),
      );
    },
  },
});

export const externalLinks = defineHastPlugin({
  name: "external-links",
  element: {
    filter: ["a"],
    visit(node, context) {
      const href = node.properties?.href;

      if (typeof href !== "string" || !URL.canParse(href)) {
        return;
      }

      const protocol = new URL(href).protocol;
      if (protocol !== "http:" && protocol !== "https:") {
        return;
      }

      context.setProperty(node, "target", "_blank");
      context.setProperty(node, "rel", "noopener noreferrer");
    },
  },
});
