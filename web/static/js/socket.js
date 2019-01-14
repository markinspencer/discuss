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
    const textArea = document.querySelector("textarea");
    const content = textArea.value;
    channel.push("comment:add", { content });

    textArea.value = "";
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

const commentTemplate = comment => {
  let email = comment.user ? comment.user.email : "Anonymous";
  return `<li class="collection-item"> ${
    comment.content
  } <div class="secondary-content"> ${email} </div> </li>`;
};

window.createSocket = createSocket;
