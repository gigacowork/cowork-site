(() => {
const embeddedAgentIcons = {"sales":"data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjAgMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGlkPSJpY29uXzAzMjQuc3ZnIiBkPSJNMTguNDMxNCAxNi44SDE5LjQxMThDMTkuNzM2NiAxNi44IDIwIDE3LjA2ODYgMjAgMTcuNEMyMCAxNy43MzE0IDE5LjczNjYgMTggMTkuNDExOCAxOEgwLjU4ODIxNkMwLjI2MzM1MyAxOCAwIDE3LjczMTQgMCAxNy40QzAgMTcuMDY4NiAwLjI2MzM1MyAxNi44IDAuNTg4MjE2IDE2LjhIMS41Njg2MlYxMC4yQzEuNTY4NjIgOS44Njg2MyAxLjgzMTk3IDkuNjAwMDEgMi4xNTY4NCA5LjYwMDAxSDYuMjc0NTRWNS40MDAwMkM2LjI3NDU0IDUuMDY4NjYgNi41Mzc5IDQuNzk5OTcgNi44NjI3NiA0Ljc5OTk3SDExLjc2NDdWMC41OTk5OEMxMS43NjQ3IDAuMjY4NjIgMTIuMDI4MSAwIDEyLjM1MjkgMEgxNy44NDMyQzE4LjE2OCAwIDE4LjQzMTQgMC4yNjg2MiAxOC40MzE0IDAuNTk5OThWMTYuOFpNMTEuNzY0NyA2SDcuNDUwOThWMTYuOEgxMS43NjQ3VjZaTTYuMjc0NTQgMTAuOEgyLjc0NTEyVjE2LjhINi4yNzQ1NFYxMC44Wk0xNy4yNTQ5IDEuMjAwMDNIMTIuOTQxMlYxNi44SDE3LjI1NDlWMS4yMDAwM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=","marketing":"data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5IiB2aWV3Qm94PSIwIDAgMjAgMTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGlkPSJpY29uXzA4OTUuc3ZnIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIwIDkuMTEzNTFDMTkuOTk3NCA2LjY1MTE4IDE4LjA1NiA0LjY1NTc0IDE1LjY2MDQgNC42NTMwNkgxMS45MDA5QzExLjY1NzUgNC42Mzg0OSA2Ljc5NzIxIDQuMzA2ODkgMi4xNjk4NCAwLjMxNzczQzEuNjExMSAtMC4xNjQyOTIgMC43NzgwNTQgLTAuMDg5Mzk3NiAwLjMwOTE1IDAuNDg0ODM3QzAuMTA5NzYzIDAuNzI5MDEyIDAuMDAwMzM5OTkzIDEuMDM3NDcgMi45MTMxNGUtMDUgMS4zNTYyMlYxNi44NzA3Qy0wLjAwMzM5MDM1IDE3LjM5ODggMC4yOTQ0NzcgMTcuODc5OSAwLjc2MTM5MiAxOC4xMDAzQzAuOTM2NjU1IDE4LjE4NCAxLjEyNzUyIDE4LjIyNzcgMS4zMjA4MiAxOC4yMjgzQzEuNjMxOCAxOC4yMjg1IDEuOTMyNzIgMTguMTE1IDIuMTY5ODQgMTcuOTA4M0M1Ljk0MzQ2IDE0LjY1NzkgOS44NjUxIDEzLjgzNTcgMTEuMzIwNyAxMy42MzVWMTYuOTMxOEMxMS4zMjA2IDE3LjM4NTcgMTEuNTQxMiAxNy44MDk2IDExLjkwODUgMTguMDYxNUwxMi45NDYyIDE4Ljc3MjJDMTMuNTUzMyAxOS4xODc4IDE0LjM3MzMgMTkuMDE4OCAxNC43Nzc2IDE4LjM5NDhDMTQuODU5OCAxOC4yNjc5IDE0LjkyMDYgMTguMTI3NyAxNC45NTc2IDE3Ljk4TDE2LjEwMTkgMTMuNTQ3N0MxOC4zMTM1IDEzLjMxMjEgMTkuOTk1NCAxMS4zOTg4IDIwIDkuMTEzNTFaTTEuMTc2NjQgMTYuOTk1QzEuMjQzODUgMTcuMDc2OSAxLjM2Mjg1IDE3LjA4NzIgMS40NDI0OSAxNy4wMTgxQzUuNTk0MzYgMTMuNDM5MSA5LjgzODY4IDEyLjYzNjIgMTEuMzE3OSAxMi40NTY5VjUuNzY2MTlDOS44MzU4OCA1LjU5MDcxIDUuNTkwNjMgNC43ODg3OSAxLjQzOTY5IDEuMjA4OEMxLjQwNjg2IDEuMTc4OTUgMS4zNjQ1OSAxLjE2MjQgMS4zMjA4MiAxLjE2MjI4QzEuMjkzMDMgMS4xNjI4NSAxLjI2NTczIDEuMTY5NDMgMS4yNDA2MiAxLjE4MTdDMS4xNzMwMyAxLjIxMTQ4IDEuMTMwMDEgMS4yODA2OSAxLjEzMjEzIDEuMzU2MjJWMTYuODcwN0MxLjEzMjMxIDE2LjkxNjIgMS4xNDgwNCAxNi45NjAzIDEuMTc2NjQgMTYuOTk1Wk0xMy42MzI2IDE3LjgzODFDMTMuNzMzNyAxNy44NjQgMTMuODM2MSAxNy44MDA4IDEzLjg2MTQgMTcuNjk2OUwxNC45MjM2IDEzLjU3MzlIMTIuNDUxOVYxNi45Mzg2QzEyLjQ1MTcgMTcuMDAzNiAxMi40ODMyIDE3LjA2NDUgMTIuNTM1OCAxNy4xMDA1TDEzLjU3MzYgMTcuODExM0MxMy41OTE2IDE3LjgyMzYgMTMuNjExNSAxNy44MzI3IDEzLjYzMjYgMTcuODM4MVpNMTIuNDUyOCAxMi40MTAzSDE1LjY2MDRDMTcuNDMxOCAxMi40MTAzIDE4Ljg2NzkgMTAuOTM0MiAxOC44Njc5IDkuMTEzNTFDMTguODY3OSA3LjI5MjcxIDE3LjQzMTggNS44MTY2NyAxNS42NjA0IDUuODE2NjdIMTIuNDUyOFYxMi40MTAzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==","legal":"data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGlkPSJpY29uXzExNTcuc3ZnIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE5Ljk2MDkgOC40OTEwNUwxNy4wNTE5IDEuNjgyNTdDMTYuOTUyNiAxLjQ1MDY1IDE2LjY4ODggMS4zMTk5MSAxNi40MjgyIDEuMzczNjRMMTAuNTQ1NCAyLjU5NzQ3VjAuNTEwNjIyQzEwLjU0NTQgMC4yMjg2MTMgMTAuMzAxMiAwIDEwIDBDOS42OTg3NiAwIDkuNDU0NTYgMC4yMjg2MTMgOS40NTQ1NiAwLjUxMDYyMlYyLjgyNDY4TDMuMzM2MzcgNC4xMDEyOUMzLjE2MDQxIDQuMTM3ODYgMy4wMTUxMiA0LjI1MzUyIDIuOTQ4MiA0LjQxMDIyTDAuMDM5MDYyNSAxMS4yMTg3QzAuMDE0MDE5NCAxMS4yNzc4IDAuMDAwNzc4ODUzIDExLjM0MDcgMCAxMS40MDQyQzAgMTMuMjY0NyAyLjExOTA4IDEzLjk1NzUgMy40NTQ1NyAxMy45NTc1QzQuNzkwMDEgMTMuOTU3NSA2LjkwOTA5IDEzLjI2NDcgNi45MDkwOSAxMS40MDQyQzYuOTA4ODUgMTEuMzM5MiA2Ljg5NTYxIDExLjI3NDkgNi44NzAwMyAxMS4yMTQ1TDQuMTk5MSA0Ljk2NDI2TDkuNDU0NTYgMy44NzA2NlYxNC45Nzg3SDcuODE4MTlDNy41MTY5NiAxNC45Nzg3IDcuMjcyNzUgMTUuMjA3NCA3LjI3Mjc1IDE1LjQ4OTRDNy4yNzI3NSAxNS43NzE0IDcuNTE2OTYgMTYgNy44MTgxOSAxNkgxMi4xODE4QzEyLjQ4MyAxNiAxMi43MjczIDE1Ljc3MTQgMTIuNzI3MyAxNS40ODk0QzEyLjcyNzMgMTUuMjA3NCAxMi40ODMgMTQuOTc4NyAxMi4xODE4IDE0Ljk3ODdIMTAuNTQ1NFYzLjY0MzRMMTUuNjU1NSAyLjU4MDQyTDEzLjEzIDguNDkxMDVDMTMuMTA0NCA4LjU1MTQ1IDEzLjA5MTEgOC42MTU4NCAxMy4wOTA5IDguNjgwODVDMTMuMDkwOSAxMC41NDEzIDE1LjIxIDExLjIzNDEgMTYuNTQ1NSAxMS4yMzQxQzE3Ljg4MDkgMTEuMjM0MSAyMCAxMC41NDEzIDIwIDguNjgwODVDMTkuOTk5OCA4LjYxNTg0IDE5Ljk4NjUgOC41NTE0NSAxOS45NjA5IDguNDkxMDVaTTEuODY1NDcgMTIuNTQ4MUMyLjM1MjYyIDEyLjc5ODcgMi44OTg2NSAxMi45MzIxIDMuNDU0NTcgMTIuOTM2MkM0LjA1MjczIDEyLjkzNjIgNS43MzI3MiAxMi42NjgxIDUuODIwOTEgMTEuNDk1M0wzLjQ1NzI3IDUuOTcxMDlMMS4wOTM2MyAxMS40OTUzQzEuMTI0NTQgMTEuOTM3IDEuMzc3MjUgMTIuMjgxNyAxLjg2NTQ3IDEyLjU0ODFaTTE0Ljk1NjQgOS44MjQ3QzE1LjQ0MzUgMTAuMDc1NCAxNS45ODk2IDEwLjIwODcgMTYuNTQ1NSAxMC4yMTI4QzE3LjE0MzYgMTAuMjEyOCAxOC44MjM2IDkuOTQ0NjcgMTguOTExOCA4Ljc3MTkzTDE2LjU0ODIgMy4yNDc2NEwxNC4xODQ1IDguNzcxOTNDMTQuMjE1NSA5LjIxMzYyIDE0LjQ2ODIgOS41NTgyOCAxNC45NTY0IDkuODI0N1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=","procurement":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMTZMMTYuNzIwMSAxNS4yNzMzQzE5LjQ0ODYgMTUuMDQ2IDIwLjA2MTEgMTQuNDUgMjAuMzYzNSAxMS43Mjg5TDIxIDYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNiA2SDIyIiBzdHJva2U9IndoaXRlIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iNiIgY3k9IjIwIiByPSIyIiBzdHJva2U9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjE3IiBjeT0iMjAiIHI9IjIiIHN0cm9rZT0id2hpdGUiLz4KPHBhdGggZD0iTTggMjBMMTUgMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMiAySDIuOTY2QzMuOTEwNjggMiA0LjczNDE0IDIuNjI0NTkgNC45NjMyNiAzLjUxNDkzTDcuOTM4NTIgMTUuMDc2NUM4LjA4ODg3IDE1LjY2MDggNy45NjAyIDE2LjI3OTcgNy41ODgyNCAxNi43NjE2TDYuNjMyMTMgMTgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K","hr":"data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJ1c2VycyI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik0xNS45OTU1IDIxVjE5QzE1Ljk5NTUgMTcuOTM5MSAxNS41NzQxIDE2LjkyMTcgMTQuODI0IDE2LjE3MTZDMTQuMDczOCAxNS40MjE0IDEzLjA1NjQgMTUgMTEuOTk1NSAxNUg1Ljk5NTU0QzQuOTM0NjcgMTUgMy45MTcyNSAxNS40MjE0IDMuMTY3MTEgMTYuMTcxNkMyLjQxNjk2IDE2LjkyMTcgMS45OTU1NCAxNy45MzkxIDEuOTk1NTQgMTlMMS45OTU1NCAyMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTguOTk1NTQgMTFDMTEuMjA0NyAxMSAxMi45OTU1IDkuMjA5MTQgMTIuOTk1NSA3QzEyLjk5NTUgNC43OTA4NiAxMS4yMDQ3IDMgOC45OTU1NCAzQzYuNzg2NCAzIDQuOTk1NTQgNC43OTA4NiA0Ljk5NTU0IDdDNC45OTU1NCA5LjIwOTE0IDYuNzg2NCAxMSA4Ljk5NTU0IDExWiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGlkPSJWZWN0b3JfMyIgZD0iTTIyLjAwNDUgMjEuMDAwMlYxOS4wMDAyQzIyLjAwMzggMTguMTEzOSAyMS43MDg4IDE3LjI1MjkgMjEuMTY1OCAxNi41NTI1QzIwLjYyMjggMTUuODUyIDE5Ljg2MjYgMTUuMzUxNyAxOS4wMDQ1IDE1LjEzMDIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBpZD0iVmVjdG9yXzQiIGQ9Ik0xNi4wMDQ1IDMuMTMwMTZDMTYuODY0OSAzLjM1MDQ2IDE3LjYyNzUgMy44NTA4NiAxOC4xNzIxIDQuNTUyNDdDMTguNzE2NyA1LjI1NDA4IDE5LjAxMjMgNi4xMTY5OSAxOS4wMTIzIDcuMDA1MTZDMTkuMDEyMyA3Ljg5MzMzIDE4LjcxNjcgOC43NTYyNCAxOC4xNzIxIDkuNDU3ODVDMTcuNjI3NSAxMC4xNTk1IDE2Ljg2NDkgMTAuNjU5OSAxNi4wMDQ1IDEwLjg4MDIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+Cjwvc3ZnPgo=","finance":"data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE3IiBoZWlnaHQ9IjIwLjc3MjUiIHZpZXdCb3g9IjAgMCAxNyAyMC43NzI1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBpZD0iSWNvbiIgZD0iTTEyLjUgMi41QzEyLjUgMy42MDQ1NyA5LjgxMzcxIDQuNSA2LjUgNC41QzMuMTg2MjkgNC41IDAuNSAzLjYwNDU3IDAuNSAyLjVNMTIuNSAyLjVDMTIuNSAxLjM5NTQzIDkuODEzNzEgMC41IDYuNSAwLjVDMy4xODYyOSAwLjUgMC41IDEuMzk1NDMgMC41IDIuNU0xMi41IDIuNVY2LjVNMC41IDIuNVY2LjVDMC41IDcuNjA0NTcgMy4xODYyOSA4LjUgNi41IDguNU0xNi41IDguMzg2MkMxNi41IDkuNDkwNzcgMTMuODEzNyAxMC4zODYyIDEwLjUgMTAuMzg2MkM3LjE4NjI5IDEwLjM4NjIgNC41IDkuNDkwNzcgNC41IDguMzg2Mk0xNi41IDguMzg2MkMxNi41IDcuNTE1MzggMTQuODMwNCA2Ljc3NDU2IDEyLjUgNi41TTE2LjUgOC4zODYyVjEyLjM4NjJDMTYuNSAxMy40OTA4IDEzLjgxMzcgMTQuMzg2MiAxMC41IDE0LjM4NjJNNi41IDguNUM1Ljc5ODczIDguNSA1LjEyNTU2IDguNDU5OSA0LjUgOC4zODYyVjEyLjM4NjJNMTIuNSA2LjVDMTIuNSA3LjYwNDU3IDkuODEzNzEgOC41IDYuNSA4LjVNMTAuNSAxNC4zODYyQzExLjIwMTMgMTQuMzg2MiAxMS44NzQ0IDE0LjM0NjEgMTIuNSAxNC4yNzI0QzEyLjUgMTUuMzc3IDkuODEzNzEgMTYuMjcyNCA2LjUgMTYuMjcyNEMzLjE4NjI5IDE2LjI3MjQgMC41IDE1LjM3NyAwLjUgMTQuMjcyNE0xMi41IDE0LjI3MjRWMTguMjcyNUMxMi41IDE5LjM3NyA5LjgxMzcxIDIwLjI3MjUgNi41IDIwLjI3MjVDMy4xODYyOSAyMC4yNzI1IDAuNSAxOS4zNzcgMC41IDE4LjI3MjVWMTQuMjcyNE0wLjUgMTQuMjcyNEMwLjUgMTMuNDAxNiAyLjE2OTYyIDEyLjY2MDggNC41IDEyLjM4NjJNNC41IDEyLjM4NjJDNC41IDEzLjQ5MDggNy4xODYyOSAxNC4zODYyIDEwLjUgMTQuMzg2MiIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L3N2Zz4K"};
const agents = [
  {
    key: "sales", tag: "@Агент продаж",
    steps: [
      ["Внеси итоги последнего разговора в карточку клиента", "Актуализирую CRM"],
      ["Покажи этапы, на которых мы теряем больше всего сделок", "Анализирую воронку продаж"],
    ],
  },
  {
    key: "marketing", tag: "@Агент маркетинга",
    steps: [
      ["Спрогнозируй помесячный бюджет на следующий год", "Готовлю маркетинговый бюджет"],
      ["Покажи динамику и тональность упоминаний за месяц", "Собираю аналитику по упоминаниям бренда"],
    ],
  },
  {
    key: "legal", tag: "@Агент-юрист",
    steps: [
      ["Найди нестандартные условия и риски в соглашении", "Проверяю NDA"],
      ["Выдели спорные пункты и позиции сторон", "Разбираю протокол разногласий"],
    ],
  },
  {
    key: "procurement", tag: "@Агент по закупкам",
    steps: [
      ["Подготовь анализ предложений: полнота и комплектность", "Проверяю комплектность ТКП"],
      ["Обоснуй выбор поставщика по итогам сравнения", "Формирую пояснительную записку"],
    ],
  },
  {
    key: "hr", tag: "@HR-агент",
    steps: [
      ["Сформулируй задачи и требования для менеджера по продажам", "Составляю описание вакансии"],
      ["Выдели сильные стороны и риски кандидата", "Читаю расшифровку интервью"],
    ],
  },
  {
    key: "finance", tag: "@Финансовый агент",
    steps: [
      ["Сделай отчет по расходам за август", "Классифицирую банковские операции по статьям"],
    ],
  },
];

const workspace = document.querySelector(".workspace");
const liteTheme = true;
if (liteTheme) {
  const assets = [
    [".brand", "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE4OS4wMjQiIGhlaWdodD0iMzkuOTk5OSIgdmlld0JveD0iMCAwIDE4OS4wMjQgMzkuOTk5OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IkxvZ28iPgo8cGF0aCBpZD0iVmVjdG9yIiBkPSJNMTY5LjYyIDM5LjU4NDlIMTYxLjE0MlYyMC44NjM1SDE2OS42MlYyNy44MzIxTDE3OC40MyAyMC44NjM1SDE4OC44NDVMMTc3LjgyNyAyOS4zMThMMTg5LjAyNCAzOS41ODQ5SDE3Ny45NUwxNjkuNjIgMzEuNjgzNFYzOS41ODQ5WiIgZmlsbD0iIzE3MUYyRCIvPgo8cGF0aCBpZD0iVmVjdG9yXzIiIGQ9Ik0xNDEuMjg3IDI1LjcyMjFWMjguNDYzNUgxNDguODE0QzE1MC4yMjIgMjguNDYzNSAxNTAuNzI0IDI3Ljg4NTQgMTUwLjcyNCAyNy4xMDUyVjI3LjA4MDRDMTUwLjcyNCAyNi4zMDAyIDE1MC4yMjIgMjUuNzIyMSAxNDguODE0IDI1LjcyMjFIMTQxLjI4N1pNMTQxLjI4NyAzMy4zOTY0VjM5LjU4ODRIMTMyLjgwOVYyMC44NjcySDE1MS44NTdDMTU2LjU2MiAyMC44NjcyIDE1OS40NTcgMjIuMjAwNSAxNTkuNDU3IDI1LjYyMjdWMjUuODc0N0MxNTkuNDU3IDI4LjY5NCAxNTYuOTQxIDI5Ljc1MDggMTU1LjM4MiAzMC4xNTE1QzE1OC4wMjUgMzAuNjggMTU5LjUzIDMyLjMxNDggMTU5LjUzIDM0LjcyOTlWMzcuNTQ5M0MxNTkuNTMgMzguNjU1OCAxNTkuNjgzIDM5LjEwOTcgMTU5Ljg4NSAzOS40MzYxVjM5LjU4ODRIMTUxLjE3OEMxNTEuMDUyIDM5LjQ2NDQgMTUxLjAwMiAzOS4yMTI3IDE1MS4wMDIgMzguODMzMlYzNi41OTUzQzE1MS4wMDIgMzQuNTgwOSAxNTAuMDQ0IDMzLjQgMTQ3LjMwMiAzMy40SDE0MS4yODdWMzMuMzk2NFoiIGZpbGw9IiMxNzFGMkQiLz4KPHBhdGggaWQ9IlZlY3Rvcl8zIiBkPSJNMTEzLjQ1NyAzOS45OTk5TDExMi4wMiAzOS45Nzg1Qzk5LjE0MjYgMzkuODAxMyA5Ny4xMDM0IDM1LjA0NTYgOTcuNTUwNCAzMS4yODYzQzk3LjYxMDcgMzAuNzgyOCA5Ny43MjQyIDMwLjA3NyA5Ny45Mjk3IDI5LjM0NjRDOTguOTc5NSAyNS41Njk2IDEwMi4yNjMgMjAuMzM1IDExNi4zMTEgMjAuNTMwMkwxMTcuNzE2IDIwLjU0NzlDMTMwLjg2NCAyMC43Mjg4IDEzMi42OTUgMjUuNDU2MiAxMzIuMjYzIDI5LjA4NzVDMTMyLjE4MiAyOS43Njg1IDEzMi4wMDcgMzAuNDk5IDEzMS44MDkgMzEuMTI2OEMxMzAuNjQ4IDM0Ljg1MDQgMTI3LjYxNyA0MC4xOTE0IDExMy40NTMgMzkuOTkyOEwxMTMuNDU3IDM5Ljk5OTlaTTEyMi4zNzggMjkuNjYyMkMxMjIuNTk2IDI3Ljk0NTYgMTIxLjIyOSAyNi4xNTgyIDExNS44ODEgMjYuMDgzOEMxMTAuMDYyIDI2LjAwMjMgMTA4LjA5IDI4LjA0ODYgMTA3LjYxMiAyOS44MzZDMTA3LjU1NSAzMC4wMzc5IDEwNy40OTEgMzAuMjg5OSAxMDcuNDQ2IDMwLjY2NThDMTA3LjIyOCAzMi4zODIyIDEwOC41NDEgMzQuMzE4NSAxMTMuODU5IDM0LjM5MjlDMTE5LjU4OCAzNC40NzExIDEyMS41ODggMzIuNDUzMiAxMjIuMTY5IDMwLjU5MTJDMTIyLjI3MyAzMC4yNDAxIDEyMi4zNDYgMjkuOTM1MiAxMjIuMzc4IDI5LjY1ODZWMjkuNjYyMloiIGZpbGw9IiMxNzFGMkQiLz4KPHBhdGggaWQ9IlZlY3Rvcl80IiBkPSJNNzUuNjY1OSAzOS41ODQ5SDY0LjYxOUw1Ny43MjQ3IDIwLjg2MzVINjcuMzYzOEw3MS4wMTMyIDMyLjUzODNMNzQuMzA3NiAyMC44NjM1SDg0LjI0ODJMODcuNTQyOSAzMi41NjMxTDkxLjAxNDcgMjAuODYzNUg5OS45OTc3TDkzLjAyOTEgMzkuNTg0OUg4Mi4yMzM5TDc4LjkzOTIgMjguNTM3OEw3NS42Njk1IDM5LjU4NDlINzUuNjY1OVoiIGZpbGw9IiMxNzFGMkQiLz4KPHBhdGggaWQ9IlZlY3Rvcl81IiBkPSJNNDMuNDc4OCAyMC41MTI1SDQ0LjY4ODFDNTcuMDkzNSAyMC41MTI1IDU4Ljg1NTkgMjYuMDQ4NCA1OC44NTU5IDI5Ljc5N1YzMC41NTI0QzU4Ljg1NTkgMzQuMjUxMiA1Ny4wOTM1IDM5LjkzOTcgNDQuNjg4MSAzOS45Mzk3SDQzLjQ3ODhDMzEuMDk4MyAzOS45Mzk3IDI5LjMzNTggMzQuMjUxMiAyOS4zMzU4IDMwLjU1MjRWMjkuNzk3QzI5LjMzNTggMjYuMDQ4NCAzMS4wOTgzIDIwLjUxMjUgNDMuNDc4OCAyMC41MTI1Wk01MC4wNzE1IDMwLjMwMDdWMjkuOTQ5NUM1MC4wNzE1IDI4LjEzNzMgNDguNzg3OCAyNi4wNDg0IDQ0LjA4MTcgMjYuMDQ4NEMzOS4zNzU3IDI2LjA0ODQgMzguMDkxOCAyOC4xMzczIDM4LjA5MTggMjkuOTQ5NVYzMC4yNTA5QzM4LjA5MTggMzIuMDg3OSAzOS4zNzU3IDM0LjM1NDEgNDQuMDgxNyAzNC4zNTQxQzQ4Ljc4NzggMzQuMzU0MSA1MC4wNzE1IDMyLjE0MTIgNTAuMDcxNSAzMC4zMDRWMzAuMzAwN1oiIGZpbGw9IiMxNzFGMkQiLz4KPHBhdGggaWQ9IlZlY3Rvcl82IiBkPSJNMTQuODk0OSAzOS45Mzk3SDEzLjk2NTdDMS43Mzc4IDM5LjkzOTcgMCAzNC4yNzk1IDAgMzAuNTUyNFYyOS43OTdDMCAyNi4wNDg0IDEuNjEwMDQgMjAuNTEyNSAxMy45NjU3IDIwLjUxMjVIMTQuODk0OUMyNi44MjE0IDIwLjUxMjUgMjguNDU2MyAyNS42OTczIDI4LjQ1NjMgMjguMjg2MVYyOC42MzczSDE5Ljc3NDZDMTkuNjQ3MSAyOC4xNTg2IDE5LjE0NjkgMjYuMDQ0OCAxNC4zMTMyIDI2LjA0NDhDOS40Nzk1NCAyNi4wNDQ4IDguNzUyNDggMjguMTA5IDguNzUyNDggMjkuOTQ2VjMwLjI0NzNDOC43NTI0OCAzMi4wMzQ3IDkuNzU5NjUgMzQuMzUwNiAxNC4zMzggMzQuMzUwNkMxOS4yNDYzIDM0LjM1MDYgMTkuNjk2NyAzMS45ODUxIDE5Ljc3NDYgMzEuNTgwOEgyOC40NTYzVjMyLjEwOTNDMjguNDU2MyAzNC42NzY5IDI2LjgyMTQgMzkuOTM2MSAxNC44OTQ5IDM5LjkzNjFWMzkuOTM5N1oiIGZpbGw9IiMxNzFGMkQiLz4KPHBhdGggaWQ9IlZlY3Rvcl83IiBkPSJNMTA5LjU2MyAxOC4xMjIxTDEwMC44ODggMC40NTAzMThDMTAwLjg1MyAwLjM3OTQ5NyAxMDAuNzg2IDAuMzM2ODQ3IDEwMC43MTEgMC4zMzY4NDdIOTAuMTAwM0M5MC4wMjIxIDAuMzM2ODQ3IDg5Ljk1MTMgMC4zODMwNjkgODkuOTIyOSAwLjQ1Mzg5TDgyLjc0MTQgMTYuMDMzMkM4Mi42NTk5IDE2LjIxMDUgODIuMzkwMyAxNi4xNTc0IDgyLjM5MDMgMTUuOTU1MlY4LjkwODYxQzgyLjM5MDMgOC43ODQ0MiA4Mi4yOTQ2IDguNjg1MDMgODIuMTc3NiA4LjY4NTAzSDcxLjA0MThDNzAuOTI0OCA4LjY4NTAzIDcwLjgyNTYgOC43ODc5OSA3MC44MjU2IDguOTA4NjFWMTEuNjY3N0M3MC44MjU2IDExLjc5MTggNzAuOTIxNCAxMS44OTEgNzEuMDQxOCAxMS44OTFINzMuNDUzNUM3My42NzY5IDExLjg5MSA3My42NDE0IDEyLjA3NTUgNzMuNTkxOCAxMi4xMjE1QzcyLjkyMTQgMTIuNzYzNSA3MS42NjYxIDEzLjM2NjQgNjkuMzAwNiAxMy4zNjY0QzY1LjAzMDcgMTMuMzY2NCA2NC4wOTQ2IDExLjEyODcgNjQuMDk0NiA5LjQwNDk1VjkuMTE0MzJDNjQuMDk0NiA3LjM0MTAxIDY0LjkzODUgNS4zNDQzMyA2OS4yNzk0IDUuMzQ0MzNDNzIuNDcxMSA1LjM0NDMzIDczLjYzNzggNi4zOTA1OCA3NC4wODQ3IDcuMTUzMTVDNzQuMTE2NyA3LjIwMjc1IDc0LjE2NjMgNy4yMzQ2OCA3NC4yMjMgNy4yMzQ2OEg4Mi4yNzMyQzgyLjM2NTUgNy4yMzQ2OCA4Mi40NDAxIDcuMTUzMTUgODIuNDM2NSA3LjA1NzMzQzgyLjIzMDggNC40NDcyNiA4MC4zMTU2IDAgNjkuODE0OCAwSDY4Ljk0NTlDNTcuNDMwOCAwIDU1LjkzMDcgNS4zMjMxIDU1LjkzMDcgOC45Njg5MVY5LjY5OTM0QzU1LjkzMDcgMTMuMjk1NCA1Ny41NTE0IDE4Ljc2MzkgNjguOTQ1OSAxOC43NjM5SDY5LjgxNDhDNzIuMzUwNSAxOC43NjM5IDc0LjQzOTIgMTguMTI5MSA3Ni4wODEyIDE3LjE5NjVDNzYuMjE2MSAxNy4xMTg1IDc2LjM3OTIgMTcuMjIxMyA3Ni4zNzkyIDE3LjM4MVYxOC4yMTc3Qzc2LjM3OTIgMTguMzMxMiA3Ni40NzE0IDE4LjQyNyA3Ni41Nzc4IDE4LjQyN0g4OS40NTQ3Qzg5LjUzMjcgMTguNDI3IDg5LjYwMzcgMTguMzgxIDg5LjYzOTIgMTguMzAyOEw5MC42MDM4IDE2LjA0MzlDOTAuNjM1NyAxNS45NjU5IDkwLjcwNjcgMTUuOTE5NyA5MC43ODgyIDE1LjkxOTdIOTkuNzc4NEM5OS44NTYzIDE1LjkxOTcgOTkuOTI3MiAxNS45NjU5IDk5Ljk1NTUgMTYuMDQzOUwxMDAuOTQ1IDE4LjMwNjRDMTAwLjk3NyAxOC4zNzc0IDEwMS4wNDggMTguNDMwNiAxMDEuMTIyIDE4LjQzMDZIMTA5LjM4NUMxMDkuNTMxIDE4LjQzMDYgMTA5LjYzMSAxOC4yNjc1IDEwOS41NjMgMTguMTI5M1YxOC4xMTg1VjE4LjEyMjFaTTk3LjM4MSAxMC45NDA2SDkzLjExMTFDOTIuOTY5MiAxMC45NDA2IDkyLjg2OTggMTAuNzgxMSA5Mi45MzM3IDEwLjY0OThMOTUuMDQ3NCA1Ljc4NzdDOTUuMTE4MyA1LjYyNDY0IDk1LjMzODMgNS42MjQ2NCA5NS40MDkxIDUuNzg3N0w5Ny41NjUzIDEwLjY0OThDOTcuNjI1NiAxMC43ODggOTcuNTMgMTAuOTQ0MiA5Ny4zODgxIDEwLjk0NDJIOTcuMzgxVjEwLjk0MDZaIiBmaWxsPSIjMTcxRjJEIi8+CjxwYXRoIGlkPSJWZWN0b3JfOCIgZD0iTTEzLjgzMSA1LjM0NzkyQzE3LjEzNjIgNS4zNDc5MiAxOC4zNDU1IDYuMzk0MTcgMTguODE3MiA3LjE1NjU0QzE4Ljg0OTIgNy4yMDYxMyAxOC45MDIzIDcuMjM4MDcgMTguOTU5MSA3LjIzODA3SDI3LjMwNzNDMjcuNDAzMSA3LjIzODA3IDI3LjQ4NDYgNy4xNTY1MyAyNy40Nzc1IDcuMDYwOTFDMjcuMjY4MiA0LjQ1MDY0IDI1LjI4MjIgMC4wMDM1ODU4MiAxNC4zOTQ4IDAuMDAzNTg1ODJIMTMuNDk3NUMxLjU1MzMxIDAuMDAzNTg1ODIgMCA1LjMyNjY5IDAgOC45NzIzVjkuNzAyOTNDMCAxMy4yOTg5IDEuNjczOTIgMTguNzY3NSAxMy40OTc1IDE4Ljc2NzVIMTQuMzk0OEMxNy4wMTkxIDE4Ljc2NzUgMTkuMTg2IDE4LjEzMjcgMjAuODkxOSAxNy4xOTk5QzIxLjAzMDIgMTcuMTIxOSAyMS4xOTY4IDE3LjIyNDkgMjEuMTk2OCAxNy4zODQ0VjE4LjIyMTNDMjEuMTk2OCAxOC4zMzQ4IDIxLjI4OSAxOC40MzA2IDIxLjQwNjEgMTguNDMwNkgyNy4yMjkzQzI3LjM0MjggMTguNDMwNiAyNy40Mzg0IDE4LjMzODQgMjcuNDM4NCAxOC4yMjEzVjguOTE1NTZDMjcuNDM4NCA4Ljc5MTM3IDI3LjMzNTYgOC42OTIxOSAyNy4yMTUgOC42OTIxOUgxNS42NzE1QzE1LjU0NzQgOC42OTIxOSAxNS40NDgyIDguNzk0OTQgMTUuNDQ4MiA4LjkxNTU2VjExLjY3NDZDMTUuNDQ4MiAxMS43OTg4IDE1LjU1MDkgMTEuODk4MiAxNS42NzE1IDExLjg5ODJIMTguMTY4MUMxOC4zOTg3IDExLjg5ODIgMTguMzYzMSAxMi4wODI1IDE4LjMxIDEyLjEyODdDMTcuNjE0OSAxMi43NzA1IDE2LjMxMzUgMTMuMzczMyAxMy44NTkzIDEzLjM3MzNDOS40MzY4OCAxMy4zNzMzIDguNDU4MDggMTEuMTM1NiA4LjQ1ODA4IDkuNDEyMTFWOS4xMjEyOEM4LjQ1ODA4IDcuMzQ4MTcgOS4zMzA1NSA1LjM1MTQ5IDEzLjgzMSA1LjM1MTQ5SDEzLjgyMzhMMTMuODMxIDUuMzQ3OTJaIiBmaWxsPSIjMTcxRjJEIi8+CjxwYXRoIGlkPSJWZWN0b3JfOSIgZD0iTTU1LjQ2MiA1LjQ2MTE1VjAuNTQ5NDgzQzU1LjQ2MiAwLjQzNjAxIDU1LjM2OTcgMC4zNDAxOTUgNTUuMjUyNyAwLjM0MDE5NUgyOS4wNjI3QzI4Ljk0OTIgMC4zNDAxOTUgMjguODUzNCAwLjQzMjQzOSAyOC44NTM0IDAuNTQ5NDgzVjUuNDYxMTVDMjguODUzNCA1LjU3NDYyIDI4Ljk0NTcgNS42NzA0NCAyOS4wNjI3IDUuNjcwNDRIMzcuOTE0NEMzOC4wMjc4IDUuNjcwNDQgMzguMTIzNyA1Ljc2MjY5IDM4LjEyMzcgNS44Nzk1M1YxMi45MDE2QzM4LjEyMzcgMTMuMDE1IDM4LjAzMTQgMTMuMTEwNiAzNy45MTQ0IDEzLjExMDZIMjkuMDYyN0MyOC45NDkyIDEzLjExMDYgMjguODUzNCAxMy4yMDI5IDI4Ljg1MzQgMTMuMzE5OVYxOC4yMjgyQzI4Ljg1MzQgMTguMzQxNyAyOC45NDU3IDE4LjQzNzMgMjkuMDYyNyAxOC40MzczSDU1LjI1MjdDNTUuMzY2MiAxOC40MzczIDU1LjQ2MiAxOC4zNDUzIDU1LjQ2MiAxOC4yMjgyVjEzLjMxOTlDNTUuNDYyIDEzLjIwNjUgNTUuMzY5NyAxMy4xMTA2IDU1LjI1MjcgMTMuMTEwNkg0Ni41MDM4QzQ2LjM5MDMgMTMuMTEwNiA0Ni4yOTQ1IDEzLjAxODYgNDYuMjk0NSAxMi45MDE2VjUuODc5NTNDNDYuMjk0NSA1Ljc2NjA2IDQ2LjM4NjcgNS42NzA0NCA0Ni41MDM4IDUuNjcwNDRINTUuMjUyN0M1NS4zNjYyIDUuNjcwNDQgNTUuNDYyIDUuNTc4MTkgNTUuNDYyIDUuNDYxMTVaIiBmaWxsPSIjMTcxRjJEIi8+CjwvZz4KPC9zdmc+Cg=="],
    [".composer-tools .tool-icon:nth-child(1) img", "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE5LjU4OTQiIGhlaWdodD0iMTkuNTg5NCIgdmlld0JveD0iMCAwIDE5LjU4OTQgMTkuNTg5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ikljb24iPgo8cGF0aCBpZD0iQ29sb3ItbGF5ZXIiIGQ9Ik05Ljc5NDI0IDMuNDY5MDVDMTAuMTMyMyAzLjQ2OTA1IDEwLjQwNjUgMy43NDMyNiAxMC40MDY1IDQuMDgxMzVWOS4xODI5MUgxNS41MDgxQzE1Ljg0NjEgOS4xODI5MSAxNi4xMjAyIDkuNDU2MzUgMTYuMTIwNCA5Ljc5NDI0QzE2LjEyMDQgMTAuMTMyMyAxNS44NDYyIDEwLjQwNjUgMTUuNTA4MSAxMC40MDY1SDEwLjQwNjVWMTUuNTA4MUMxMC40MDY1IDE1Ljg0NjIgMTAuMTMyMyAxNi4xMjA0IDkuNzk0MjQgMTYuMTIwNEM5LjQ1NjM1IDE2LjEyMDIgOS4xODI5MSAxNS44NDYxIDkuMTgyOTEgMTUuNTA4MVYxMC40MDY1SDQuMDgxMzVDMy43NDMyNiAxMC40MDY1IDMuNDY5MDUgMTAuMTMyMyAzLjQ2OTA1IDkuNzk0MjRDMy40NjkyOCA5LjQ1NjM1IDMuNzQzNDEgOS4xODI5MSA0LjA4MTM1IDkuMTgyOTFIOS4xODI5MVY0LjA4MTM1QzkuMTgyOTEgMy43NDM0MSA5LjQ1NjM1IDMuNDY5MjggOS43OTQyNCAzLjQ2OTA1WiIgZmlsbD0iIzE3MUYyRCIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPC9nPgo8L3N2Zz4K"],
    [".composer-tools .tool-icon:nth-child(2) img", "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE5LjU4OTQiIGhlaWdodD0iMTkuNTg5NCIgdmlld0JveD0iMCAwIDE5LjU4OTQgMTkuNTg5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ikljb24iPgo8cGF0aCBpZD0iQ29sb3ItbGF5ZXIiIGQ9Ik0xNS41MDg3IDEuODM2NzhDMTYuNzQ4MSAxLjgzNzAxIDE3Ljc1MjcgMi44NDE0OSAxNy43NTI4IDQuMDgwOTJWMTUuNTA4N0MxNy43NTI2IDE2Ljc0OCAxNi43NDggMTcuNzUyNiAxNS41MDg3IDE3Ljc1MjhINC4wODA5MkMyLjg0MTQ5IDE3Ljc1MjcgMS44MzcwMSAxNi43NDgxIDEuODM2NzggMTUuNTA4N1Y0LjA4MDkyQzEuODM2ODkgMi44NDE0MSAyLjg0MTQxIDEuODM2ODkgNC4wODA5MiAxLjgzNjc4SDE1LjUwODdaTTQuMDgwOTIgMy4wNjA0MkMzLjUxNzU5IDMuMDYwNTIgMy4wNjA1MiAzLjUxNzU5IDMuMDYwNDIgNC4wODA5MlYxNS41MDg3QzMuMDYwNjQgMTYuMDcxOSAzLjUxNzY3IDE2LjUyODEgNC4wODA5MiAxNi41MjgySDE1LjUwODdDMTYuMDcxOCAxNi41MjggMTYuNTI4IDE2LjA3MTggMTYuNTI4MiAxNS41MDg3VjQuMDgwOTJDMTYuNTI4MSAzLjUxNzY3IDE2LjA3MTkgMy4wNjA2NCAxNS41MDg3IDMuMDYwNDJINC4wODA5MlpNMTEuODEwNCA2LjkxMjk2QzEyLjA0OTUgNi42NzM5NSAxMi40Mzc2IDYuNjczOTEgMTIuNjc2NiA2LjkxMjk2QzEyLjkxNTYgNy4xNTIwMSAxMi45MTU2IDcuNTQwMTMgMTIuNjc2NiA3Ljc3OTE3TDcuNzc5MTcgMTIuNjc2NkM3LjU0MDEzIDEyLjkxNTYgNy4xNTIwMSAxMi45MTU2IDYuOTEyOTYgMTIuNjc2NkM2LjY3MzkxIDEyLjQzNzYgNi42NzM5NSAxMi4wNDk1IDYuOTEyOTYgMTEuODEwNEwxMS44MTA0IDYuOTEyOTZaIiBmaWxsPSIjMTcxRjJEIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8L2c+Cjwvc3ZnPgo="],
    [".composer-actions > img", "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiB2aWV3Qm94PSIwIDAgMjggMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJNaWNyb3Bob25lIEljb24iPgo8cGF0aCBpZD0iSWNvbiIgZD0iTTE0LjAwMDcgMjAuOTk5OUM5LjQ5MDMzIDIwLjk5OTkgNS44MzM5OCAxNy4zNDM2IDUuODMzOTggMTIuODMzM00xNC4wMDA3IDIwLjk5OTlDMTguNTExIDIwLjk5OTkgMjIuMTY3MyAxNy4zNDM2IDIyLjE2NzMgMTIuODMzM00xNC4wMDA3IDIwLjk5OTlWMjQuNDk5OU0xNC4wMDA3IDE2LjMzMzNDMTIuMDY3NyAxNi4zMzMzIDEwLjUwMDcgMTQuNzY2MiAxMC41MDA3IDEyLjgzMzNWNS44MzMyNUMxMC41MDA3IDMuOTAwMjYgMTIuMDY3NyAyLjMzMzI1IDE0LjAwMDcgMi4zMzMyNUMxNS45MzM2IDIuMzMzMjUgMTcuNTAwNyAzLjkwMDI2IDE3LjUwMDcgNS44MzMyNVYxMi44MzMzQzE3LjUwMDcgMTQuNzY2MiAxNS45MzM2IDE2LjMzMzMgMTQuMDAwNyAxNi4zMzMzWiIgc3Ryb2tlPSIjMTcxRjJEIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvZz4KPC9zdmc+Cg=="],
    [".composer-actions span img", "data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJJY29uIj4KPHBhdGggaWQ9IkNvbG9yLWxheWVyIiBkPSJNOS42MDQ3MyAzLjY4MTE0QzkuODUwMjIgMy40ODEwMSAxMC4yMTI5IDMuNDk2MyAxMC40NDE2IDMuNzI1MDlMMTYuMjc0NyA5LjU1ODFDMTYuNTE4NyA5LjgwMjE3IDE2LjUxODcgMTAuMTk3OCAxNi4yNzQ3IDEwLjQ0MTlDMTYuMDMwNiAxMC42ODU5IDE1LjYzNDkgMTAuNjg1OSAxNS4zOTA5IDEwLjQ0MTlMMTAuNjI0MyA1LjY3NTI4VjE1LjgzMzVDMTAuNjI0MSAxNi4xNzg1IDEwLjM0NDQgMTYuNDU4NSA5Ljk5OTI3IDE2LjQ1ODVDOS42NTQyOCAxNi40NTg0IDkuMzc0NCAxNi4xNzg1IDkuMzc0MjcgMTUuODMzNVY1LjY3NTI4TDQuNjA3NjYgMTAuNDQxOUM0LjM2MzU3IDEwLjY4NTcgMy45Njc4NyAxMC42ODU5IDMuNzIzODggMTAuNDQxOUMzLjQ4MDAzIDEwLjE5NzkgMy40ODAwOSA5LjgwMjE0IDMuNzIzODggOS41NTgxTDkuNTU3ODYgMy43MjUwOUw5LjYwNDczIDMuNjgxMTRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjk1Ii8+CjwvZz4KPC9zdmc+Cg=="],
  ];
  assets.forEach(([selector, src]) => { document.querySelector(selector).src = src; });
}
const composer = document.querySelector(".composer");
const prompt = document.querySelector("#prompt");
const selectedAgent = document.querySelector("#selected-agent");
const agentSymbol = document.querySelector("#agent-symbol");
const agentName = document.querySelector("#agent-name");
const sendButton = document.querySelector(".composer-actions span");
const statTasks = document.querySelector("#stat-tasks");
const statDocs = document.querySelector("#stat-docs");
const statHours = document.querySelector("#stat-hours");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
// Keep desktop Chromium and Firefox rendering unchanged.
const safariEffects = /AppleWebKit/i.test(navigator.userAgent)
  && (!/Chrome|Chromium|Edg|OPR|Android/i.test(navigator.userAgent)
    || /iPad|iPhone|iPod/i.test(navigator.userAgent));
document.documentElement.classList.toggle("safari-effects", safariEffects);
const placeholder = "Чем я могу помочь?";
const lines = new Array(agents.length);
const progressJobs = new Set();
let completedTasks = 0;
const activeProgress = new Set();
let finishingCycle = false;
const packet = document.createElement("div");
packet.className = "packet";
packet.setAttribute("aria-hidden", "true");
// Both exported sprites have the same geometry: rotate about the bright head,
// not the SVG centre, so turning cannot move the head off the connector.
const packetHeadX = 14.3029 / 34.9537 * 100;
const packetHeadY = 22.3269 / 36.311 * 100;
const packetSpriteHeading = Math.atan2(22.3269 - 18.1555, 14.3029 - 17.4768) * 180 / Math.PI;
packet.style.transformOrigin = packetHeadX + "% " + packetHeadY + "%";
const svgNamespace = "http://www.w3.org/2000/svg";
const packetTrail = document.createElementNS(svgNamespace, "svg");
packetTrail.classList.add("packet-trail");
packetTrail.setAttribute("aria-hidden", "true");
const trailGradient = document.createElementNS(svgNamespace, "linearGradient");
trailGradient.id = "packet-trail-gradient";
trailGradient.setAttribute("gradientUnits", "userSpaceOnUse");
[
  ["0%", "#1962ff", "0"],
  ["40%", "#3999ff", ".32"],
  ["78%", "#5cd4e7", ".8"],
  ["100%", "#fff", "1"],
].forEach(([offset, color, opacity]) => {
  const stop = document.createElementNS(svgNamespace, "stop");
  stop.setAttribute("offset", offset);
  stop.setAttribute("stop-color", color);
  stop.setAttribute("stop-opacity", opacity);
  trailGradient.append(stop);
});
const trailDefs = document.createElementNS(svgNamespace, "defs");
trailDefs.append(trailGradient);
const trailGlow = document.createElementNS(svgNamespace, "path");
trailGlow.classList.add("packet-trail-glow");
const trailCore = document.createElementNS(svgNamespace, "path");
trailCore.classList.add("packet-trail-core");
packetTrail.append(trailDefs, trailGlow, trailCore);
workspace.append(packetTrail, packet);

const initialTaskLabels = Object.freeze({
  sales: "Готовлю бриф к встрече",
  marketing: "Анализирую конкурентов",
  legal: "Сверяю версии договоров",
  procurement: "Ищу поставщиков",
  hr: "Оцениваю резюме",
  finance: "Анализирую P&L",
});
const resetHistory = [];
function inspectTaskDOM() {
  return entries.map(({ agent, tasks, count }) => ({
    agent: agent.key,
    children: tasks.children.length,
    tasks: tasks.querySelectorAll(".task").length,
    labels: [...tasks.querySelectorAll("p")].map(node => node.textContent),
    bars: tasks.querySelectorAll(".progress").length,
    count: count.textContent,
  }));
}
// Read-only snapshots: no credentials or request inputs are recorded.
window.coworkDiagnostics = Object.freeze({
  version: "reset-v2",
  snapshot: inspectTaskDOM,
  get resets() { return JSON.parse(JSON.stringify(resetHistory)); },
});
const entries = [...document.querySelectorAll(".agent-card")].map((card, index) => {
  const tasks = card.querySelector(".tasks");
  const initial = createInitialTask(agents[index].key);
  tasks.replaceChildren(initial);
  return {
    agent: agents[index],
    card,
    tasks,
    initial,
    count: card.querySelector(".task-count"),
    index,
  };
});

const sequence = [
  ...agents.map((agent, index) => ({ index, prompt: agent.steps[0][0], task: agent.steps[0][1] })),
  ...agents.slice(0, 5).map((agent, index) => ({ index, prompt: agent.steps[1][0], task: agent.steps[1][1] })),
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const easeOut = (t) => 1 - (1 - t) ** 3;

function animateFor(duration, update, shouldStop = () => false) {
  return new Promise((resolve) => {
    const start = performance.now();
    function tick(now) {
      if (shouldStop()) {
        resolve();
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      update(t);
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

function setProgress(task, value) {
  const amount = Math.max(0, Math.min(100, value));
  const displayedAmount = amount >= 100 ? 100 : Math.floor(amount);
  const progress = task.querySelector(".progress");
  progress.querySelector(".progress-track").style.setProperty("--progress", `${amount}%`);
  progress.lastElementChild.textContent = `${displayedAmount}%`;
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");
  progress.setAttribute("aria-valuenow", String(displayedAmount));
}

function animateProgress(task, duration = 7000) {
  setProgress(task, 0);
  return new Promise((resolve) => {
    const start = performance.now();
    const job = { task, amount: 0, resolve };
    activeProgress.add(job);
    function tick(now) {
      if (finishingCycle) return;
      const t = Math.min(1, (now - start) / duration);
      job.amount = 100 * (t - .12 * Math.sin(2 * Math.PI * t));
      setProgress(task, job.amount);
      if (!task.isConnected || t >= 1) {
        activeProgress.delete(job);
        resolve();
      } else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function finishAllProgress() {
  // One clock and one render callback for every remaining bar, including the last.
  const jobs = [...activeProgress].map((job) => ({ job, from: job.amount }));
  return animateFor(500, (t) => {
    for (const { job, from } of jobs) {
      job.amount = t >= 1 ? 100 : from + (100 - from) * smoothStep(t);
      setProgress(job.task, job.amount);
    }
    if (t >= 1) {
      for (const { job } of jobs) {
        activeProgress.delete(job);
        job.resolve();
      }
    }
  });
}

function taskLabel(count) {
  return count === 1 ? "1 задача" : count < 5 ? `${count} задачи` : `${count} задач`;
}

function createTask(text) {
  const task = document.createElement("div");
  task.className = "task is-entering";
  const label = document.createElement("p");
  label.textContent = text;
  const progress = document.createElement("div");
  progress.className = "progress";
  const track = document.createElement("span");
  track.className = "progress-track";
  const percentage = document.createElement("span");
  percentage.textContent = "0%";
  progress.append(track, percentage);
  task.append(label, progress);
  setProgress(task, 0);
  task.addEventListener("animationend", () => task.classList.remove("is-entering"), { once: true });
  return task;
}

function createInitialTask(key) {
  const task = createTask(initialTaskLabels[key]);
  task.className = "task is-initial";
  setProgress(task, 100);
  return task;
}

function setStats(step) {
  statTasks.textContent = String(6 + step);
  statDocs.textContent = String(Math.round(24 + 38 * step / sequence.length));
  statHours.textContent = String(Math.round(12 + 90 * step / sequence.length));
}

function animateStats(previous, next) {
  if (finishingCycle) {
    setStats(completedTasks);
    return Promise.resolve();
  }
  const from = [
    6 + previous,
    Math.round(24 + 38 * previous / sequence.length),
    Math.round(12 + 90 * previous / sequence.length),
  ];
  const to = [
    6 + next,
    Math.round(24 + 38 * next / sequence.length),
    Math.round(12 + 90 * next / sequence.length),
  ];
  return animateFor(325, (t) => {
    const eased = easeOut(t);
    [statTasks, statDocs, statHours].forEach((element, index) => {
      element.textContent = String(Math.round(from[index] + (to[index] - from[index]) * eased));
    });
  });
}

function resetStage() {
  finishingCycle = false;
  completedTasks = 0;
  prompt.textContent = placeholder;
  selectedAgent.classList.remove("is-visible", "is-agent");
  selectedAgent.style.removeProperty("width");
  agentName.textContent = "";
  agentSymbol.removeAttribute("src");
  composer.classList.remove("is-processing");
  sendButton.classList.remove("is-pressing");
  packet.style.opacity = "0";
  packetTrail.style.opacity = "0";
  entries.forEach((entry) => {
    const { card, tasks, count, agent } = entry;
    entry.initial = createInitialTask(agent.key);
    tasks.replaceChildren(entry.initial);
    count.textContent = taskLabel(tasks.children.length);
    card.classList.remove("is-receiving");
  });
  setStats(0);
  const cards = inspectTaskDOM();
  const valid = cards.every(card => card.children === 1 && card.tasks === 1
    && card.bars === 1 && card.labels.length === 1
    && card.labels[0] === initialTaskLabels[card.agent]);
  resetHistory.push({ at: new Date().toISOString(), valid, cards });
  if (resetHistory.length > 8) resetHistory.shift();
  if (!valid) console.warn("COWORK: unexpected task DOM after reset", cards);
}

async function hydrateLines() {
  const images = [...document.querySelectorAll(".flow-lines img")];
  await Promise.all(images.map(async (image, index) => {
    try {
      const response = await fetch(image.src);
      if (!response.ok) throw new Error(`SVG ${response.status}`);
      const svg = new DOMParser().parseFromString(await response.text(), "image/svg+xml").documentElement;
      if (svg.localName !== "svg") throw new Error("Invalid SVG");
      svg.setAttribute("class", image.getAttribute("class"));
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      image.replaceWith(svg);
      lines[index] = svg.querySelector("path");
      const path = lines[index];
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0);
      const end = path.getPointAtLength(length);
      // The center is to the right of left-column paths and left of right-column paths.
      const fromStart = index < 3 ? start.x > end.x : start.x < end.x;
      svg.style.setProperty("--dash-end", fromStart ? "-10" : "10");
    } catch (error) {
      console.warn("Could not animate connector", index + 1, error);
    }
  }));
}

async function hydrateBackground() { /* Light background is already in HTML. */ }

function screenPoint(path, length, matrix = path.getScreenCTM()) {
  const point = path.getPointAtLength(length);
  return point.matrixTransform(matrix);
}

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const smoothStep = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
// Integrate one velocity profile over the complete route: accelerate, cruise, settle.
// Velocity stays continuous when the wave crosses the edges of the cards.
function waveTravel(phase) {
  const t = clamp01(phase);
  const acceleration = .12;
  const deceleration = .22;
  const cruiseEnd = 1 - deceleration;
  const area = 1 - (acceleration + deceleration) / 2;
  if (t < acceleration) {
    return (t / 2 - acceleration * Math.sin(Math.PI * t / acceleration) / (2 * Math.PI)) / area;
  }
  if (t <= cruiseEnd) return (t - acceleration / 2) / area;
  const u = (t - cruiseEnd) / deceleration;
  return (cruiseEnd - acceleration / 2 + deceleration * (u / 2 + Math.sin(Math.PI * u) / (2 * Math.PI))) / area;
}

function setFlowLight(element, offset, opacity) {
  element.style.setProperty("--flow-offset", `${offset.toFixed(3)}px`);
  element.style.setProperty("--flow-opacity", clamp01(opacity).toFixed(4));
}

async function animateHandoff(index, onReceive) {
  const path = lines[index];
  const card = entries[index].card;
  const direction = index < 3 ? -1 : 1;
  const compact = matchMedia("(max-width: 850px)").matches;
  const bounds = workspace.getBoundingClientRect();
  const sourceWidth = composer.getBoundingClientRect().width;
  const cardWidth = card.getBoundingClientRect().width;
  const sceneScale = compact ? 1 : bounds.width / 1920;
  const svg = path?.ownerSVGElement;
  const length = path?.getTotalLength() || 0;
  const matrix = !compact && path ? path.getScreenCTM() : null;
  const pathScale = matrix ? Math.hypot(matrix.a, matrix.b) : 1;
  const routeLength = matrix ? length * pathScale : sourceWidth * .28;
  const sourceLength = sourceWidth * .25;
  const arrivalDistance = sourceLength + routeLength;
  const totalDistance = arrivalDistance + cardWidth * 1.38;
  const duration = Math.max(2400, totalDistance / (290 * sceneScale) * 1000);
  const fromStart = path && (index < 3
    ? path.getPointAtLength(0).x > path.getPointAtLength(length).x
    : path.getPointAtLength(0).x < path.getPointAtLength(length).x);
  // Sample the curve once, not after style writes on every animation frame.
  // Store workspace-relative coordinates so scrolling cannot offset the packet.
  let routeSamples = [];
  let routeBounds = bounds;
  let routeScale = pathScale;
  let routeDirty = true;
  const invalidateRoute = () => { routeDirty = true; };
  const routeObserver = new ResizeObserver(invalidateRoute);
  routeObserver.observe(workspace);
  window.addEventListener("resize", invalidateRoute);
  function refreshRoute() {
    routeDirty = false;
    if (!path || compact) return;
    const transform = path.getScreenCTM();
    if (!transform) return;
    routeBounds = workspace.getBoundingClientRect();
    routeScale = Math.hypot(transform.a, transform.b);
    const count = Math.max(2, Math.min(2048, Math.ceil(length)));
    routeSamples = Array.from({ length: count + 1 }, (_, i) => {
      const point = screenPoint(path, length * i / count, transform);
      return { x: point.x - routeBounds.left, y: point.y - routeBounds.top };
    });
  }
  function routePoint(along) {
    const position = clamp01(along / length) * (routeSamples.length - 1);
    const index = Math.min(Math.floor(position), routeSamples.length - 2);
    const fraction = position - index;
    const a = routeSamples[index];
    const b = routeSamples[index + 1];
    return { x: a.x + (b.x - a.x) * fraction, y: a.y + (b.y - a.y) * fraction };
  }
  let received = false;
  let outlined = false;

  try {
    await animateFor(duration, (phase) => {
      if (routeDirty) refreshRoute();
      const distance = waveTravel(phase) * totalDistance;
      const insideCard = distance - arrivalDistance;
      const fadeIn = smoothStep(phase / .07);
      const sourceEnvelope = 1 - smoothStep((distance - sourceLength) / (sourceWidth * .6));
      const targetEnvelope = smoothStep((insideCard + cardWidth * .11) / (cardWidth * .22))
        * (1 - smoothStep((insideCard - cardWidth * .65) / (cardWidth * .65)));
      setFlowLight(composer, direction * (sourceWidth / 2 + distance - sourceLength), fadeIn * sourceEnvelope);
      setFlowLight(card, direction * (insideCard - cardWidth / 2), fadeIn * targetEnvelope);

      if (insideCard >= 0 && !outlined) {
        card.classList.add("is-receiving");
        outlined = true;
      }
      if (insideCard >= cardWidth * .95) card.classList.remove("is-receiving");
      if (insideCard >= cardWidth * .16 && !received) {
        received = true;
        onReceive();
      }

      const travel = (distance - sourceLength) / routeLength;
      const inFlight = travel >= 0 && travel < 1;
      svg?.classList.toggle("is-routing", inFlight);
      if (!path || !inFlight || compact || routeSamples.length < 2) {
        packet.style.opacity = "0";
        packetTrail.style.opacity = "0";
        return;
      }
      const along = (fromStart ? travel : 1 - travel) * length;
      const point = routePoint(along);
      // A centred tangent from the cached route is smooth, including its ends.
      const tangentStep = Math.min(2, length / 100);
      const behind = routePoint(along - (fromStart ? tangentStep : -tangentStep));
      const ahead = routePoint(along + (fromStart ? tangentStep : -tangentStep));
      const heading = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
      packet.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-${packetHeadX}%, -${packetHeadY}%) rotate(${heading - packetSpriteHeading}deg)`;
      const trailLength = routeBounds.width * .024 / routeScale * (1 - smoothStep((travel - .85) / .15));
      const trailStart = fromStart
        ? Math.max(0, along - trailLength)
        : Math.min(length, along + trailLength);
      const points = Array.from({ length: 11 }, (_, sampleIndex) => {
        return routePoint(trailStart + (along - trailStart) * sampleIndex / 10);
      });
      const trailPath = points.map(({ x, y }, sampleIndex) => `${sampleIndex ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
      trailGlow.setAttribute("d", trailPath);
      trailCore.setAttribute("d", trailPath);
      trailGradient.setAttribute("x1", points[0].x);
      trailGradient.setAttribute("y1", points[0].y);
      trailGradient.setAttribute("x2", points.at(-1).x);
      trailGradient.setAttribute("y2", points.at(-1).y);
      const blendDistance = Math.min(28 * sceneScale, routeLength * .14);
      const opacity = smoothStep((distance - sourceLength) / blendDistance)
        * (1 - smoothStep((distance - arrivalDistance + blendDistance) / blendDistance));
      packet.style.opacity = String(opacity);
      packetTrail.style.opacity = String(opacity);
    });
  } finally {
    routeObserver.disconnect();
    window.removeEventListener("resize", invalidateRoute);
    packet.style.opacity = "0";
    packetTrail.style.opacity = "0";
    svg?.classList.remove("is-routing");
    card.classList.remove("is-receiving");
    setFlowLight(composer, 0, 0);
    setFlowLight(card, 0, 0);
  }
}

async function typeText(text) {
  await document.fonts.ready;
  // Lay out complete words first. Hidden letters keep their space, so a word
  // never jumps to the next line halfway through being typed.
  const letters = [];
  const fragment = document.createDocumentFragment();
  for (const token of text.split(/(\s+)/u)) {
    if (!token) continue;
    if (/^\s+$/u.test(token)) {
      fragment.append(document.createTextNode(token));
      for (const character of token) letters.push({ character });
      continue;
    }
    const word = document.createElement("span");
    word.className = "typed-word";
    for (const character of token) {
      const letter = document.createElement("span");
      letter.textContent = character;
      letter.style.visibility = "hidden";
      word.append(letter);
      letters.push({ character, letter });
    }
    fragment.append(word);
  }
  prompt.replaceChildren(fragment);
  const rhythm = [58, 76, 62, 87, 53, 71, 65, 80, 56, 72];
  for (const [index, { character, letter }] of letters.entries()) {
    if (letter) letter.style.visibility = "visible";
    const cadence = /[,.!?]/.test(character) ? 180 : character === " " ? 88 : rhythm[index % rhythm.length];
    await wait(cadence + (index > 0 && index % 20 === 0 ? 130 : 0));
  }
}

async function pressSend() {
  sendButton.classList.remove("is-pressing");
  // Restart the CSS timeline even when two steps run in quick succession.
  void sendButton.offsetWidth;
  sendButton.classList.add("is-pressing");
  await wait(700);
  sendButton.classList.remove("is-pressing");
}

async function runStep(step) {
  const entry = entries[step.index];
  await typeText(step.prompt);
  await wait(180);
  await pressSend();
  composer.classList.add("is-processing");
  await wait(50);
  agentSymbol.src = embeddedAgentIcons[entry.agent.key];
  agentName.textContent = entry.agent.tag.replace(/^@/, "");
  const chipWidth = Math.ceil(agentName.scrollWidth + 24 + 4 + 14);
  selectedAgent.style.width = `${chipWidth}px`;
  selectedAgent.classList.add("is-visible", "is-agent");
  await wait(560);
  composer.classList.remove("is-processing");
  await animateHandoff(step.index, () => {
    const task = createTask(step.task);
    entry.tasks.append(task);
    entry.count.textContent = taskLabel(entry.tasks.children.length);
    prompt.textContent = placeholder;
    // Keep the agent content and width throughout the fade-out.
    // Reset them only when the chip is fully hidden, at the next stage reset.
    selectedAgent.classList.remove("is-visible");
    if (step === sequence[sequence.length - 1]) {
      finishingCycle = true;
    }
    // Procurement starts earlier and should finish naturally before the final HR task.
    const progressDuration = entry.agent.key === "procurement" ? 3750 : 7000;
    const progressAnimation = animateProgress(task, progressDuration).then(() => {
      const previous = completedTasks;
      completedTasks += 1;
      return animateStats(previous, completedTasks);
    });
    progressJobs.add(progressAnimation);
    progressAnimation.then(() => progressJobs.delete(progressAnimation));
    if (finishingCycle) finishAllProgress();
  });
  if (step !== sequence[sequence.length - 1]) await wait(520);
}

async function runDemo() {
  await Promise.all([hydrateLines(), hydrateBackground()]);
  while (true) {
    resetStage();
    await wait(650);
    for (const step of sequence) {
      await runStep(step);
    }
    await Promise.all([...progressJobs]);
    workspace.classList.add("is-resetting");
    await wait(350);
    workspace.classList.remove("is-resetting");
  }
}

function showFinalWithoutMotion() {
  resetStage();
  entries.forEach(({ agent, tasks, count, initial }) => {
    setProgress(initial, 100);
    agent.steps.forEach(([, taskText]) => {
      const task = createTask(taskText);
      task.classList.remove("is-entering");
      setProgress(task, 100);
      tasks.append(task);
    });
    count.textContent = taskLabel(tasks.children.length);
  });
  setStats(sequence.length);
}

reduceMotion.addEventListener("change", () => location.reload());
if (reduceMotion.matches) showFinalWithoutMotion();
else runDemo().catch((error) => console.error("Demo animation stopped", error));

})();
