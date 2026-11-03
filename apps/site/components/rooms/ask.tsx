"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { cx } from "@pickler/ui";
import { ask as copy } from "@/content/site";
import { Column } from "@/components/home/column";
import { replyFor } from "@/lib/ask";

/** The reply lands this long after a question, so it reads as an answer rather than an echo. */
export const REPLY_DELAY_MS = 400;

type Message = { from: "site" | "you"; text: string };

/** A chat-shaped box that answers from a static keyword map. Honest about it when nothing matches. */
export function Ask() {
  const [messages, setMessages] = useState<Message[]>([{ from: "site", text: copy.intro }]);
  const [draft, setDraft] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [messages]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function send(question: string) {
    const text = question.trim();
    if (!text) return;
    setMessages((prior) => [...prior, { from: "you", text }]);
    setDraft("");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMessages((prior) => [
        ...prior,
        { from: "site", text: replyFor(text, copy.canned, copy.fallback) },
      ]);
    }, REPLY_DELAY_MS);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(draft);
  }

  return (
    <Column className="grid border-t border-line md:grid-cols-2">
      <div className="flex min-h-[420px] flex-col border-b border-line md:border-b-0 md:border-r">
        <div
          ref={list}
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          className="flex flex-1 flex-col gap-2.5 overflow-auto p-5"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cx(
                "max-w-[46ch] border px-3 py-2.5 text-small",
                message.from === "you"
                  ? "self-end border-fg bg-fg text-bg"
                  : "border-line bg-panel text-fg",
              )}
            >
              <span
                className={cx(
                  "mb-1 block font-mono text-[0.62rem] uppercase tracking-label",
                  message.from === "you" ? "text-line-soft" : "text-grey",
                )}
              >
                {message.from === "you" ? copy.you : copy.from}
              </span>
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex border-t border-line">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            autoComplete="off"
            className="min-w-0 flex-1 bg-bg px-4 py-3.5 text-fg focus:outline-2 focus:-outline-offset-2 focus:outline-acc"
          />
          <button
            type="submit"
            className="border-l border-line bg-acc px-4 font-mono text-label uppercase tracking-label text-acc-ink hover:bg-fg hover:text-bg"
          >
            {copy.send}
          </button>
        </form>
      </div>
      <div className="p-6">
        <p className="mb-2.5 inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
          <span aria-hidden className="size-[7px] bg-acc" />
          {copy.tryOne}
        </p>
        <ul className="grid gap-1.5">
          {copy.suggestions.map((question) => (
            <li key={question}>
              <button
                type="button"
                onClick={() => send(question)}
                className="w-full border border-line bg-panel px-3.5 py-2.5 text-left text-small text-fg hover:bg-fg hover:text-bg"
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Column>
  );
}
