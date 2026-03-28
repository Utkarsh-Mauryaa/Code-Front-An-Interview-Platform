import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { motion } from "framer-motion";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  return (
    <div className="h-full bg-[#0a0a0f] flex flex-col">
      <ResizablePanelGroup orientation="vertical" className="h-full">

        {/* QUESTION PANEL */}
        <ResizablePanel defaultSize={50} minSize={20}>
          <ScrollArea className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    {selectedQuestion.title}
                  </h2>
                  <p className="text-xs text-slate-500 tracking-wide uppercase">
                    Choose your language and solve the problem
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                    <SelectTrigger className="w-[170px] h-9 bg-[#13131e] border-white/10 text-slate-300 text-xs rounded-xl hover:border-amber-400/40 transition-colors">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#13131e] border-white/10 text-slate-300 rounded-xl">
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem
                          key={q.id}
                          value={q.id}
                          className="hover:bg-white/5 hover:text-amber-400 rounded-lg text-xs"
                        >
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[130px] h-9 bg-[#13131e] border-white/10 text-slate-300 text-xs rounded-xl hover:border-amber-400/40 transition-colors">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img src={`/${language}.png`} alt={language} className="w-4 h-4 object-contain" />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#13131e] border-white/10 text-slate-300 rounded-xl">
                      {LANGUAGES.map((lang) => (
                        <SelectItem
                          key={lang.id}
                          value={lang.id}
                          className="hover:bg-white/5 hover:text-amber-400 rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <img src={`/${lang.id}.png`} alt={lang.name} className="w-4 h-4 object-contain" />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 max-w-4xl mx-auto">
                {/* Problem Description */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="rounded-2xl border border-white/8 bg-[#13131e] overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/8">
                    <div className="p-1.5 rounded-lg bg-amber-400/10">
                      <BookIcon className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Problem Description</span>
                  </div>
                  <div className="px-5 py-4 text-sm text-slate-400 leading-relaxed">
                    <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                  </div>
                </motion.div>

                {/* Examples */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  className="rounded-2xl border border-white/8 bg-[#13131e] overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/8">
                    <div className="p-1.5 rounded-lg bg-yellow-400/10">
                      <LightbulbIcon className="h-3.5 w-3.5 text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Examples</span>
                  </div>
                  <div className="px-5 py-4">
                    <ScrollArea className="w-full rounded-xl border border-white/8">
                      <div className="p-4 space-y-4">
                        {selectedQuestion.examples.map((example, index) => (
                          <div key={index} className="space-y-2">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Example {index + 1}
                            </p>
                            <ScrollArea className="w-full">
                              <pre className="bg-[#0a0a0f] border border-white/8 p-3.5 rounded-xl text-xs font-mono text-slate-300 leading-relaxed">
                                <div><span className="text-amber-400/70">Input:</span> {example.input}</div>
                                <div><span className="text-amber-400/70">Output:</span> {example.output}</div>
                                {example.explanation && (
                                  <div className="pt-2 text-slate-500">
                                    <span className="text-amber-400/70">Explanation:</span> {example.explanation}
                                  </div>
                                )}
                              </pre>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                        ))}
                      </div>
                      <ScrollBar />
                    </ScrollArea>
                  </div>
                </motion.div>

                {/* Constraints */}
                {selectedQuestion.constraints && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    className="rounded-2xl border border-white/8 bg-[#13131e] overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/8">
                      <div className="p-1.5 rounded-lg bg-blue-400/10">
                        <AlertCircleIcon className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-white">Constraints</span>
                    </div>
                    <div className="px-5 py-4">
                      <ul className="space-y-2">
                        {selectedQuestion.constraints.map((constraint, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400/50 shrink-0" />
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            <ScrollBar />
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 hover:bg-amber-400/30 transition-colors duration-200 h-1" />

        {/* CODE EDITOR PANEL */}
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full relative bg-[#0d0d14]">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/8 bg-[#0d0d14]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-slate-500 ml-2 font-mono">solution.{language === "javascript" ? "js" : language === "python" ? "py" : "java"}</span>
            </div>
            <Editor
              height="calc(100% - 37px)"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                wordWrap: "on",
                wrappingIndent: "indent",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                renderLineHighlight: "gutter",
                smoothScrolling: true,
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default CodeEditor;