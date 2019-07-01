import { fromEvent } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import "./styles.css";

let WS_URL = "wss://echo.websocket.org";

const connectBtn = document.querySelector("#connect");
const disconnectBtn = document.querySelector("#disconnect");
const input: HTMLInputElement = document.querySelector("input");
const sendBtn = document.querySelector("#send");
const log: HTMLTextAreaElement = document.querySelector("#log");

const connect$ = fromEvent(connectBtn, "click");
const disconnect$ = fromEvent(disconnectBtn, "click");
const send$ = fromEvent(sendBtn, "click");

let ws$ = connectWs();

disconnect$.subscribe(() => {
  ws$.unsubscribe();

  disconnectBtn.setAttribute("disabled", "disabled");
  sendBtn.setAttribute("disabled", "disabled");
  connectBtn.removeAttribute("disabled");
});

connect$.subscribe(() => {
  connectBtn.setAttribute("disabled", "disabled");
  disconnectBtn.removeAttribute("disabled");
  sendBtn.removeAttribute("disabled");

  ws$ = connectWs();
});

send$.subscribe(() => {
  const msg = input.value.trim();
  ws$.next(msg);
  log.value += `SENT: ${msg}\n`;
  log.scrollTop = log.scrollWidth;

  input.value = "";
  input.focus();
});

function connectWs() {
  const ws$ = webSocket(WS_URL);
  log.value += "CONNECTING...\n";
  log.scrollTop = log.scrollHeight;
  ws$.subscribe({
    next: response => {
      log.value += `RECEIVED: ${response}\n`;
      log.scrollTop = log.scrollHeight;
    },
    complete: () => {
      log.value += "DISCONNECTED\n";
      log.scrollTop = log.scrollHeight;
    },
    error: (err: Error) => {
      console.error(err);
      log.value += `ERROR: ${err.message}\n`;
    }
  });
  return ws$;
}
