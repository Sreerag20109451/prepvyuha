import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { startNextServer } from "../helpers/next-server.mjs";

let server;
let baseUrl;

before(async () => {
  server = await startNextServer(Number(process.env.TEST_PORT ?? 3100));
  baseUrl = server.baseUrl;
});

after(async () => {
  await server?.stop();
});

async function post(path, body) {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("API integration", () => {
  test("revision API computes next interval", async () => {
    const res = await post("/api/revision/next", {
      intervalDays: 7,
      confidenceScore: 4,
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(typeof json.nextIntervalDays, "number");
    assert.equal(typeof json.nextDueAt, "number");
  });

  test("mains evaluator returns structural score", async () => {
    const res = await post("/api/evaluator/mains", {
      answerText:
        "Federalism requires devolution, cooperative institutions, and transparent fiscal transfers. In conclusion, stronger state capacity improves governance.",
      keywords: ["federalism", "devolution", "governance"],
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(typeof json.score, "number");
    assert.ok(Array.isArray(json.feedback));
  });

  test("quiz generator returns MCQs and PYQ container", async () => {
    const res = await post("/api/quiz/generate", {
      topicId: "mains-polity-core-federalism-and-devolution",
      notes: [
        {
          id: "n1",
          title: "Federalism",
          body: "Federalism devolution governance state finance commission",
          updatedAt: 1,
          syllabusLinks: [
            {
              subjectId: "mains-gs2",
              topicId: "mains-constitution-polity",
              subtopicId: "mains-polity-core-federalism-and-devolution",
            },
          ],
        },
      ],
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(Array.isArray(json.mcqs));
    assert.ok(Array.isArray(json.pyqs));
  });

  test("current affairs mapper validates and maps a syllabus subtopic", async () => {
    const res = await post("/api/current-affairs/map", {
      rawText:
        "The Supreme Court discussed federalism and fiscal devolution between Union and States in a constitutional governance dispute.",
      subjects: [
        {
          id: "mains-gs2",
          label: "Mains GS Paper II",
          topics: [
            {
              id: "mains-constitution-polity",
              label: "Constitution and Political System",
              subtopics: [
                {
                  id: "mains-polity-core-federalism-and-devolution",
                  label: "Federalism and devolution",
                },
              ],
            },
          ],
        },
      ],
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(Array.isArray(json.subtopicIds));
  });

  test("agent routes reject invalid requests with 400", async () => {
    const pyq = await post("/api/agents/pyq", {});
    const mains = await post("/api/agents/mains", {});
    assert.equal(pyq.status, 400);
    assert.equal(mains.status, 400);
  });
});
