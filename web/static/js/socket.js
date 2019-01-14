import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { token: window.userToken } });

socket.connect();

const createSocket = topicId => {
  let channel = socket.channel(`comments:${topicId}`, {});
  channel
    .join()
    .receive("ok", resp => renderComments(resp.comments))
    .receive("error", resp => console.log("Unable to join", resp));

  document.querySelector("button").addEventListener("click", () => {
    const content = document.querySelector("textarea").value;
    channel.push("comment:add", { content });
  });

  channel.on(`comments:${topicId}:new`, renderComment);
};

const renderComments = comments => {
  const renderedComments = comments.map(commentTemplate).join("");
  document.querySelector(".collection").innerHTML = renderedComments;
};

const renderComment = ({ comment }) => {
  const renderedComment = commentTemplate(comment);
  document.querySelector(".collection").innerHTML += renderedComment;
};

const commentTemplate = comment =>
  `<li class="collection-item"> ${comment.content} </li>`;

window.createSocket = createSocket;
