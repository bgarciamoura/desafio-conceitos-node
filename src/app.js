const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

function validateRepositoryId(request, response, next) {
	const { id } = request.params;

	if (!isUuid(id)) {
		return response.status(400).json({ error: 'Invalid repository ID!' });
	}

	return next();
}

app.get("/repositories", (request, response) => {
	response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body;

	const id = uuidv4();

	const repository = {
		id, title, url, techs, likes: 0
	};

	repositories.push(repository);

	response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
	const { title, url, techs } = request.body;
	const { id } = request.params;

	const repositoryIndex = repositories.findIndex(respository => respository.id === id);

	if (repositoryIndex < 0) {
		return response.status(404).json({ error: 'Repository not found!' });
	}

	const likes = repositories[repositoryIndex].likes;

	const repository = {
		id,
		title, 
		url, 
		techs, 
		likes	
	};

	repositories[repositoryIndex] = repository;

	return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params;

	const repositoryIndex = repositories.findIndex(respository => respository.id === id);

	if (repositoryIndex < 0) {
		return response.status(404).json({ error: 'Repository not found!' });
	}

	repositories.splice(repositoryIndex, 1);

	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;

	const repositoryIndex = repositories.findIndex(respository => respository.id === id);

	if (repositoryIndex < 0) {
		return response.status(404).json({ error: 'Repository not found!' });
	}

	repositories[repositoryIndex].likes++;
	return response.json(repositories[repositoryIndex]);
});

module.exports = app;
