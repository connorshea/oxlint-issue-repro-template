import { definePlugin, defineRule } from "oxlint";

const plugin = definePlugin({
  meta: {
    name: "example",
  },
  rules: {
    "too-many-methods": defineRule({
      meta: { type: "problem" },
      // this type-errors, why?
      create(context) {
        return {
          ClassDeclaration(node) {
            const methodCount = node.body.body.filter(
              (member) => member.type === "MethodDefinition"
            ).length;
            if (methodCount >= 3) {
              context.report({ message: "Too many methods on this class! bad!", node });
            }
          },
        };
      },
    }),
    // Source: https://github.com/glide-browser/glide/blob/265f237e5a5e201dd3e1e69228f0945005791453/.oxlint-plugin.mjs
    "require-using-for-temp-prefs": defineRule({
      meta: { type: "problem" },
      // this type-errors, why?
      createOnce(context) {
        return {
          VariableDeclaration(node) {
            switch (node.kind) {
              case "using":
              case "await using": {
                return;
              }

              case "var":
              case "let":
              case "const": {
                //
              }
            }

            for (const decl of node.declarations ?? []) {
              if (
                decl.init?.type === "CallExpression" && decl.init.callee.type === "Identifier"
                && decl.init.callee.name === "temp_prefs"
              ) {
                context.report({
                  node: decl,
                  message: "Use `using prefs = temp_prefs()` instead of `const/let/var prefs = temp_prefs()`.",
                });
              }
            }
          },
        };
      },
    }),
  },
});

export default plugin;
