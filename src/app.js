const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const payload = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(payload)

  return response.json(payload)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs, likes } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  const repository = { ...repositories[repoIndex], url, title, techs, likes: 0 };

  repositories[repoIndex] = repository;

  response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send() 
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  const el = repositories[repoIndex];
  const repository = { ...repositories[repoIndex], likes: el.likes + 1 };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

module.exports = app;
