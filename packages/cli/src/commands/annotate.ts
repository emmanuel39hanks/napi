import fs from "fs";
import DependencyTreeManager from "../dependencyManager/dependencyManager";
import OpenAI from "openai";
import { DependencyTree } from "../dependencyManager/types";

export default async function annotateOpenAICommandHandler(
  entrypoint: string, // Path to the entrypoint file
  openAIApiKey: string, // OpenAI API key
) {
  console.info("Annotating program...");
  const dependencyTreeManager = new DependencyTreeManager(entrypoint);

  const openAIConfig = {
    apiKey: openAIApiKey,
  };
  const openAIClient = new OpenAI(openAIConfig);

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a helpful assistant that provides detailed annotations for API endpoints.`,
    },
  ];
  messages.push({
    role: "user",
    content: `The entrypoint of my application is: ${entrypoint}.
    Here is the dependency tree of the entrypoint of: ${JSON.stringify(dependencyTreeManager.dependencyTree)}`,
  });

  messages.push({
    role: "user",
    content: `I am now going to walkthrough the files one by one and provide the content of each file.
    I want you to understand what the application is doing and where each endpoint is.`,
  });

  function iterateOverTree(tree: DependencyTree) {
    messages.push({
      role: "user",
      content: `File: ${tree.path}
      Content: ${tree.sourceCode}`,
    });

    tree.children.forEach((child) => {
      messages.push({
        role: "user",
        content: `File: ${child.path}
        Content: ${child.sourceCode}`,
      });

      iterateOverTree(child);
    });
  }
  iterateOverTree(dependencyTreeManager.dependencyTree);

  messages.push({
    role: "user",
    content: `I want you to add the following annotation above each function that handle an API call (as a comment):
    @nanoapi method:GET path:/\\/api\\/endpoint/
    You need to replace "GET" with the actual HTTP method.
    You need to replace "/\\/api\\/endpoint/" with a REGEX that match the actual endpoint path (full path).
    You are forbidden from changing the code. You can only add comments.
    If there is existing annotations, you need to replace them. If there is not, you need to add them
    I want your response to be in the following JSON format:
    [
      {
        "file": "path/to/file",
        "content": "content of the file with annotations"
      }
    ]
    Provide only a parsable JSON output as your response. Without any additional text or markdown.
    I will parse your response directly as JSON without any manipulation.`,
  });

  const chatCompletion = await openAIClient.chat.completions.create({
    messages: messages,
    model: "gpt-4-turbo",
  });

  const responseContent = chatCompletion.choices[0].message.content as string;

  const annotatedContents: { file: string; content: string }[] =
    JSON.parse(responseContent);

  for (const annotatedContent of annotatedContents) {
    const filePath = annotatedContent.file;
    const content = annotatedContent.content;
    fs.writeFileSync(filePath, content);
  }

  console.info(
    "Annotation complete. OpenAI can make mistakes, so please review the annotations.",
  );
}
