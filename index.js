const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let requestsCount = 0;

/**
 * Middleware para controlar a quantidade de requições recebidas
 */
server.use((request, response, next) => {
  requestsCount++;
  console.log(
    `method=${request.method}, url=${
      request.url
    }, requests_count=${requestsCount}`
  );
  return next();
});

/**
 * Middleware para verificar se o projeto existe
 */
function projectExists(request, response, next) {
  const { id } = request.params;
  const project = projects.find(project => project.id == id);
  if (!project) {
    return response.status(404).json({ error: `The project ${id} not found` });
  }
  return next();
}

/**
 * Rota para adicionar um projeto
 */
server.post("/projects", (request, response) => {
  const project = request.body;
  project.tasks = [];
  projects.push(project);
  return response.status(201).json();
});

/**
 * Rota recuperar os projetos
 */
server.get("/projects", (request, response) => {
  return response.json(projects);
});

/**
 * Rota para atualizar o título de um projeto
 */
server.put("/projects/:id", projectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const project = projects.find(project => project.id == id);
  project.title = title;
  return response.json(project);
});

/**
 * Método para deletar um projeto
 */
server.delete("/projects/:id", projectExists, (request, response) => {
  const { id } = request.params;
  const index = projects.findIndex(project => project.id == id);
  projects.splice(index, 1);
  response.status(204).json();
});

/**
 * Método para adicionar uma tarefa a um projeto
 */
server.post("/projects/:id/tasks", projectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const project = projects.find(project => project.id == id);
  project.tasks.push(title);
  return response.status(201).json();
});

server.listen(3000);
