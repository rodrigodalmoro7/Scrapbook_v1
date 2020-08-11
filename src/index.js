import api from "./services/api";

async function teste() {
  const response = api.get("/scraps");

  console.log(response);
}

class TaskList {
  constructor() {
    this.titleInput = document.getElementById("messageTitle");
    this.messageInput = document.getElementById("messageBody");
    this.addButton = document.getElementById("addButton");
    this.scrapsField = document.getElementById("scrapsField");
    this.editTitleInput = document.getElementById("editMessageTitle");
    this.editMessageInput = document.getElementById("editMessageBody");
    this.btnSaveEdit = document.getElementById("saveEdit");

    this.scraps = [];

    this.getScraps();
    this.setAddButtonEvent();
  }

  async getScraps() {
    const { data } = await api.get("/scraps");

    this.scraps = data;
    this.renderScraps();
  }

  // generateScrapId() {
  //   return this.scraps.length + 1;
  // }

  setAddButtonEvent() {
    this.addButton.onclick = () => this.addNewScrap();
  }

  setButtonEvents() {
    document.querySelectorAll(".delete-button").forEach((item) => {
      item.onclick = (event) => this.deleteScraps(event);
    });

    document.querySelectorAll(".edit-button").forEach((item) => {
      item.onclick = (event) => this.openEditModal(event);
    });
  }

  renderScraps() {
    this.scrapsField.innerHTML = "";

    for (const scrap of this.scraps) {
      this.generateScrap(scrap.id, scrap.title, scrap.message);
    }

    this.setButtonEvents();
  }

  generateScrap(id, title, message) {
    const cardHtml = this.createScrapCard(id, title, message);

    this.insertHtml(cardHtml);
    this.setButtonEvents();
  }

  async addNewScrap() {
    let newTitle = this.titleInput.value;
    let newMessage = this.messageInput.value;

    this.titleInput.value = "";
    this.messageInput.value = "";

    // const id = this.generateScrapId();

    const {
      data: { id, title, message },
    } = await api.post("/scraps", {
      title: newTitle,
      message: newMessage,
    });

    this.scraps.push({ id, title, message });

    this.generateScrap(id, title, message);
  }

  async deleteScraps(event) {
    event.path[2].remove();

    const scrapId = event.path[2].getAttribute("id-scrap");

    const scrapIndex = this.scraps.findIndex((scrap) => {
      return scrap.id == scrapId;
    });

    this.scraps.splice(scrapIndex, 1);
  }

  async openEditModal(event) {
    $("#editModal").modal("toggle");

    const scrapId = event.path[2].getAttribute("id-scrap");

    const scrapIndex = this.scraps.findIndex((scrap) => {
      return scrap.id == scrapId;
    });
    this.editTitleInput.value = this.scraps[scrapIndex].title;

    this.editMessageInput.value = this.scraps[scrapIndex].message;

    this.btnSaveEdit.onclick = () => this.saveChanges(scrapIndex);
  }

  saveChanges(scrapIndex) {
    let title = this.titleInput.value;
    let message = this.messageInput.value;

    this.scraps[scrapIndex] = { title, message };
    this.renderScraps();
    $("#editModal").modal("hide");
  }

  insertHtml(html) {
    this.scrapsField.innerHTML += html;
  }

  createScrapCard(id, title, message) {
    return `
      <div class="message-cards card text-white bg-dark m-2 col-3" id-scrap="${id}">
        <div class="card-header font-weight-bold">${title}</div>
        <div class="card-body">
          <p class="card-text">
            ${message}
          </p>
        </div>
        <div class="w-100 d-flex justify-content-end pr-2 pb-2">
          <button class="btn btn-danger mr-1 delete-button">Deletar</button>
          <button class="btn btn-info edit-button">Editar</button>
        </div>
      </div>
    `;
  }
}

new TaskList();