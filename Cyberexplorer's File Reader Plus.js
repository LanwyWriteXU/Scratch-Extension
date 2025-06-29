// Name: Cyberexplorer's File Reader Plus
// ID: CyberexplorersFileReaderPlus
// Author: Cyberexplorer(Code) , KOSHINO(Image)
// Description: Provides file and directory operations using File System Access API
// License: MIT

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("This extension must be run unsandboxed");
    }

    Scratch.translate.setup({
        "zh-cn": {
            "_File Reader": "赛博猫猫的文件读取器+",
            "_Select a file": "选择一个文件",
            "_Readable files": "可读取的文件",
            "_Read file [Name]": "读取文件 [Name]",
            "_Write [Content] to file [Name]": "向文件 [Name] 写入内容 [Content]",
            "_Select a folder": "选择一个文件夹",
            "_Readable folders": "可读取的文件夹",
            "_Contents of folder [Name]": "文件夹 [Name] 内容",
            "_Create/write file [FileName] with content [Content] in folder [Name]": "在文件夹 [Name] 中创建/写入文件 [FileName] 内容 [Content]",
            "_Create folder [FolderName] in folder [Name]": "在文件夹 [Name] 中创建文件夹 [FolderName]"
        },
        "en": {
            "_File Reader": "Cyberexplorer's File Reader +",
            "_Select a file": "Select a file",
            "_Readable files": "Readable files",
            "_Read file [Name]": "Read file [Name]",
            "_Write [Content] to file [Name]": "Write [Content] to file [Name]",
            "_Select a folder": "Select a folder",
            "_Readable folders": "Readable folders",
            "_Contents of folder [Name]": "Contents of folder [Name]",
            "_Create/write file [FileName] with content [Content] in folder [Name]": "Create/write file [FileName] with content [Content] in folder [Name]",
            "_Create folder [FolderName] in folder [Name]": "Create folder [FolderName] in folder [Name]"
        }
    });    

    class CyberexplorersFileReaderPlus {
        constructor(runtime) {
            this.runtime = runtime;
            this.selectedFiles = new Map(); // 存储选中的文件句柄
            this.selectedFolders = new Map(); // 存储选中的文件夹句柄
        }

        getInfo() {
            return {
                id: "CyberexplorersFileReaderPlus",
                name: Scratch.translate("File Reader"),
                color1: "#2196F3",
                color2: "#0D47A1",
                blocks: [
                    {
                        opcode: "selectFile",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("Select a file")
                    },
                    {
                        opcode: "readableFiles",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("Readable files")
                    },
                    {
                        opcode: "readFile",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("Read file [Name]"),
                        arguments: {
                            Name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "file.txt"
                            }
                        }
                    },
                    {
                        opcode: "writeToFile",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("Write [Content] to file [Name]"),
                        arguments: {
                            Content: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello, World!"
                            },
                            Name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "file.txt"
                            }
                        }
                    },
                    {
                        opcode: "selectFolder",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("Select a folder")
                    },
                    {
                        opcode: "readableFolders",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("Readable folders")
                    },
                    {
                        opcode: "folderContents",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("Contents of folder [Name]"),
                        arguments: {
                            Name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "folder"
                            }
                        }
                    },
                    {
                        opcode: "getFolderItemContent",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("Get content of [ItemName] in folder [FolderName]"),
                        arguments: {
                            FolderName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "folder"
                            },
                            ItemName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "item"
                            }
                        }
                    },                    
                    {
                        opcode: "createWriteFileInFolder",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("Create/write file [FileName] with content [Content] in folder [Name]"),
                        arguments: {
                            FileName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "newfile.txt"
                            },
                            Content: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "New file content"
                            },
                            Name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "folder"
                            }
                        }
                    },
                    {
                        opcode: "createFolderInFolder",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("Create folder [FolderName] in folder [Name]"),
                        arguments: {
                            FolderName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "newfolder"
                            },
                            Name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "folder"
                            }
                        }
                    }
                ]
            };
        }

        async selectFile() {
            try {
                const [fileHandle] = await window.showOpenFilePicker();
                const fileName = fileHandle.name;
                this.selectedFiles.set(fileName, fileHandle);
            } catch (error) {
                console.error("Error selecting file:", error);
            }
        }

        async readableFiles() {
            const files = [];
            for (const [name, handle] of this.selectedFiles) {
                files.push(name);
            }
            return files;
        }

        async readFile(args) {
            const { Name } = args;
            const fileHandle = this.selectedFiles.get(Name);
            if (!fileHandle) {
                return "";
            }
            try {
                const file = await fileHandle.getFile();
                return await file.text();
            } catch (error) {
                console.error("Error reading file:", error);
                return "";
            }
        }

        async writeToFile(args) {
            const { Content, Name } = args;
            const fileHandle = this.selectedFiles.get(Name);
            if (!fileHandle) {
                return;
            }
            try {
                const writable = await fileHandle.createWritable();
                await writable.write(Content);
                await writable.close();
            } catch (error) {
                console.error("Error writing to file:", error);
            }
        }

        async selectFolder() {
            try {
                const folderHandle = await window.showDirectoryPicker();
                const folderName = folderHandle.name;
                this.selectedFolders.set(folderName, folderHandle);
            } catch (error) {
                console.error("Error selecting folder:", error);
            }
        }

        async readableFolders() {
            const folders = [];
            for (const [name, handle] of this.selectedFolders) {
                folders.push(name);
            }
            return folders;
        }

        async folderContents(args) {
            const { Name } = args;
            const folderHandle = this.selectedFolders.get(Name);
            if (!folderHandle) {
                return "";
            }
            try {
                const entries = await folderHandle.entries();
                const contents = [];
                for await (const [name, handle] of entries) {
                    const type = handle.kind === "file" ? "file" : "directory";
                    contents.push({ name, type });
                }
                return JSON.stringify(contents, null, 2);
            } catch (error) {
                console.error("Error getting folder contents:", error);
                return "";
            }
        }

        async getFolderItemContent(args) {
            const { FolderName, ItemName } = args;
            const folderHandle = this.selectedFolders.get(FolderName);
            if (!folderHandle) {
                return Scratch.translate("No folder found");
            }
            try {
                const itemHandle = await folderHandle.getFileHandle(ItemName, { create: false });
                if (!itemHandle) {
                    return Scratch.translate("Item not found");
                }
                if (itemHandle.kind === "file") {
                    const file = await itemHandle.getFile();
                    return await file.text();
                } else if (itemHandle.kind === "directory") {
                    const entries = await itemHandle.entries();
                    const contents = [];
                    for await (const [name, handle] of entries) {
                        const type = handle.kind === "file" ? "file" : "directory";
                        contents.push({ name, type });
                    }
                    return JSON.stringify(contents, null, 2);
                }
            } catch (error) {
                console.error("Error getting folder item content:", error);
                return Scratch.translate("Error accessing item");
            }
        }        

        async createWriteFileInFolder(args) {
            const { FileName, Content, Name } = args;
            const folderHandle = this.selectedFolders.get(Name);
            if (!folderHandle) {
                return;
            }
            try {
                const fileHandle = await folderHandle.getFileHandle(FileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(Content);
                await writable.close();
                // 更新可读取的文件列表
                this.selectedFiles.set(FileName, fileHandle);
            } catch (error) {
                console.error("Error creating/writing file in folder:", error);
            }
        }

        async createFolderInFolder(args) {
            const { FolderName, Name } = args;
            const folderHandle = this.selectedFolders.get(Name);
            if (!folderHandle) {
                return;
            }
            try {
                await folderHandle.getDirectoryHandle(FolderName, { create: true });
            } catch (error) {
                console.error("Error creating folder in folder:", error);
            }
        }
    }

    Scratch.extensions.register(new CyberexplorersFileReaderPlus(Scratch.vm.runtime));
})(Scratch);
