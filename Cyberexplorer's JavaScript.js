// Name: Cyberexplorer's JavaScript
// ID: cyberexplorersJavaScript
// Author: Cyberexplorer
// License: MIT

Scratch.translate.setup({
    "zh-cn": {
        "_cyberexplorersJavaScript": "赛博猫猫的 JavaScript",
        "_Run JavaScript": "运行 JavaScript [code]",
        "_Show Result": "显示结果",
        "_Last Result": "上次结果",
        "_Evaluate Condition": "条件判断 [condition]",
        "_return": "运行并返回 [code]"
    },
    "en": {
        "_cyberexplorersJavaScript": "Cyberexplorer's JavaScript",
        "_Run JavaScript": "Run JavaScript [code]",
        "_Show Result": "Show Result",
        "_Last Result": "Last Result",
        "_Evaluate Condition": "Evaluate condition [condition]",
        "_return": "Run and return [code]"
    },
    "ja": {
        "_cyberexplorersJavaScript": "サイバーエクスプローラーの JavaScript",
        "_Run JavaScript": "JavaScript を実行する [code]",
        "_Show Result": "結果を表示する",
        "_Last Result": "最後の結果",
        "_Evaluate Condition": "条件を評価する [condition]",
        "_return": "実行して返す [code]"
    }
});


(function (Scratch) {
    "use strict";

    const EXTENSION_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMxOTc2RDIiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlNjcmlwdDwvdGV4dD48L3N2Zz4=";

    class JSRunner {
        constructor(runtime) {
            this.runtime = runtime;
            this.lastResult = "";
        }

        getInfo() {
            return {
                id: "cyberexplorersJavaScript",
                name: Scratch.translate("cyberexplorersJavaScript"),
                menuIconURI: EXTENSION_ICON,
                color1: "#4285F4",
                color2: "#34A853",
                color3: "#FBBC05",
                blocks: [
                    {
                        opcode: "runJavaScript",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("Run JavaScript"),
                        arguments: {
                            code: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "console.log('Hello World')"
                            }
                        }
                    },
                    {
                        opcode: "evaluateJavaScript",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("return"),
                        arguments: {
                            code: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "'Hello World'"
                            }
                        }
                    },
                    {
                        opcode: "evaluateCondition",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate("Evaluate condition"),
                        arguments: {
                            condition: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "1 === 1"
                            }
                        }
                    },
                    {
                        opcode: "getLastResult",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("Last Result")
                    }
                ]
            };
        }

        runJavaScript(args) {
            try {
                const code = args.code;
                const func = new Function(code);
                this.lastResult = func();
            } catch (error) {
                console.error("Error executing JavaScript:", error);
                this.lastResult = "Error: " + error.message;
            }
        }

        evaluateJavaScript(args) {
            try {
                const code = args.code;
                const func = new Function("return " + code);
                return func();
            } catch (error) {
                console.error("Error evaluating JavaScript:", error);
                return "Error: " + error.message;
            }
        }

        evaluateCondition(args) {
            try {
                const condition = args.condition;
                const func = new Function("return " + condition);
                return func();
            } catch (error) {
                console.error("Error evaluating condition:", error);
                return false;
            }
        }

        getLastResult() {
            return this.lastResult;
        }
    }

    Scratch.extensions.register(new JSRunner(Scratch.vm.runtime));
})(Scratch);
