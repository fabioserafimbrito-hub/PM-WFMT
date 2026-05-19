(function () {
  const CONFIG = window.FMT_CONFIG;
  const STORAGE_KEY = "fmt_command_cockpit_v1";
  let state = loadState();
  let selectedReportId = null;
  let actionFilter = "open";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function uid(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function currentTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function getDayName(date = new Date()) {
    return ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][date.getDay()];
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return { ...defaultState(), ...JSON.parse(raw) };
    } catch (error) {
      console.error(error);
      return defaultState();
    }
  }

  function defaultState() {
    return {
      actions: [],
      reports: [],
      customTopics: {},
      active: null,
      lastOpened: new Date().toISOString()
    };
  }

  function saveState() {
    state.lastOpened = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "Sem prazo";
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }

  function isOverdue(action) {
    if (!action.due || action.status === "Fechada") return false;
    const today = todayISO();
    return action.due < today;
  }

  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function checkpointOptions() {
    return Object.values(CONFIG.checkpoints).sort((a, b) => `${a.day}${a.time}${a.title}`.localeCompare(`${b.day}${b.time}${b.title}`));
  }

  function checkpointById(id) {
    return CONFIG.checkpoints[id] || CONFIG.checkpoints.daily_kpi;
  }

  function init() {
    $("#appMotto").textContent = CONFIG.app.motto;
    bindNavigation();
    bindStaticActions();
    renderAll();
    registerSW();
  }

  function registerSW() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(console.warn);
    }
  }

  function bindNavigation() {
    $$(".tab").forEach((btn) => {
      btn.addEventListener("click", () => openTab(btn.dataset.tab));
    });
    $$('[data-open-tab]').forEach((btn) => {
      btn.addEventListener("click", () => openTab(btn.dataset.openTab));
    });
  }

  function openTab(tab) {
    $$(".tab").forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
    $$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tab}`));
    if (tab === "checkpoint") renderCheckpoint();
    if (tab === "actions") renderActions();
    if (tab === "radar") renderRadar();
    if (tab === "reports") renderReports();
    if (tab === "config") renderConfig();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindStaticActions() {
    $("#startRecommendedBtn").addEventListener("click", () => startCheckpoint(getRecommendedCheckpointId()));
    $("#startSelectedCheckpointBtn").addEventListener("click", () => startCheckpoint($("#checkpointSelect").value));
    $("#printAgendaBtn").addEventListener("click", () => window.print());
    $("#discardDraftBtn").addEventListener("click", discardDraft);
    $("#addTopicBtn").addEventListener("click", addTopic);
    $("#addKpiBtn").addEventListener("click", addKpi);
    $("#addManualActionBtn").addEventListener("click", () => showActionEditor("session"));
    $("#newGlobalActionBtn").addEventListener("click", () => showActionEditor("global"));
    $("#saveDraftBtn").addEventListener("click", () => { collectActiveFromDOM(); saveState(); toast("Rascunho guardado."); });
    $("#validateCheckpointBtn").addEventListener("click", () => validateAndShow());
    $("#closeCheckpointBtn").addEventListener("click", closeCheckpoint);
    $("#copyReportBtn").addEventListener("click", copySelectedReport);
    $("#shareReportBtn").addEventListener("click", shareSelectedReport);
    $("#downloadReportBtn").addEventListener("click", downloadSelectedReport);
    $("#exportAllBtn").addEventListener("click", exportAllData);
    $("#importDataBtn").addEventListener("click", toggleImportData);
    $("#saveCustomTopicBtn").addEventListener("click", saveCustomTopic);
    $("#clearDataBtn").addEventListener("click", clearLocalData);
    $("#generateCultureReportBtn").addEventListener("click", generateCultureReport);
    $("#installHelpBtn").addEventListener("click", () => {
      showModal("Instalação iOS", `<p>Publica no GitHub Pages, abre o link no Safari, toca em <strong>Partilhar</strong> e escolhe <strong>Adicionar ao ecrã principal</strong>.</p><p>A app guarda os dados localmente no iPhone.</p>`);
    });
    $$(".filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        actionFilter = btn.dataset.actionFilter;
        $$(".filter").forEach((b) => b.classList.toggle("active", b === btn));
        renderActions();
      });
    });
  }

  function renderAll() {
    renderSelects();
    renderToday();
    renderAgenda();
    renderCheckpoint();
    renderActions();
    renderRadar();
    renderReports();
    renderConfig();
  }

  function renderSelects() {
    const options = checkpointOptions().map((c) => `<option value="${c.id}">${c.day} ${c.time} — ${escapeHtml(c.title)}</option>`).join("");
    $("#checkpointSelect").innerHTML = options;
    $("#configCheckpointSelect").innerHTML = options;
  }

  function getRecommendedCheckpointId() {
    const dayName = getDayName();
    const agendaDay = CONFIG.agenda.find((d) => d.day === dayName) || CONFIG.agenda[0];
    if (!agendaDay) return "daily_kpi";
    const now = currentTime();
    const next = agendaDay.items.find((item) => /^\d{2}:\d{2}$/.test(item.time) && item.time >= now) || agendaDay.items[0];
    return next.checkpointId;
  }

  function renderToday() {
    const dayName = getDayName();
    const agendaDay = CONFIG.agenda.find((d) => d.day === dayName) || CONFIG.agenda[0];
    const openActions = state.actions.filter((a) => a.status !== "Fechada");
    const overdue = openActions.filter(isOverdue);
    const critical = openActions.filter((a) => a.priority === "Crítica");
    const openReportsToday = state.reports.filter((r) => (r.date || "").slice(0, 10) === todayISO()).length;

    $("#todayTitle").textContent = `${dayName} — ${agendaDay ? agendaDay.items[0].title : "Comando"}`;
    $("#todaySummary").textContent = "Comanda o dia por checkpoints: preparar, reunir, decidir, cobrar, comunicar e aprender.";
    $("#todayStats").innerHTML = [
      [openActions.length, "ações abertas"],
      [overdue.length, "ações atrasadas"],
      [critical.length, "críticas"],
      [openReportsToday, "checkpoints fechados hoje"]
    ].map(([value, label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");

    const items = agendaDay?.items || [];
    $("#todayTimeline").innerHTML = items.map((item) => timelineHtml(item)).join("") || `<p class="muted">Sem agenda configurada para hoje.</p>`;
    $$("#todayTimeline .start-cp").forEach((btn) => btn.addEventListener("click", () => startCheckpoint(btn.dataset.checkpointId)));

    const criticalItems = [...overdue, ...critical.filter((a) => !overdue.some((o) => o.id === a.id))].slice(0, 6);
    $("#criticalActions").innerHTML = criticalItems.length ? criticalItems.map(actionHtml).join("") : `<p class="muted">Sem ações críticas/atrasadas registadas. Mantém o standard.</p>`;
    bindActionCardEvents($("#criticalActions"));
  }

  function timelineHtml(item) {
    const cp = checkpointById(item.checkpointId);
    return `<div class="timeline-item">
      <div class="timeline-time">${escapeHtml(item.time)}</div>
      <div><div class="timeline-title">${escapeHtml(item.title)}</div><div class="timeline-sub">${escapeHtml(item.subtitle || cp.output)}</div></div>
      <button class="secondary start-cp" data-checkpoint-id="${item.checkpointId}">Abrir</button>
    </div>`;
  }

  function renderAgenda() {
    $("#weekGrid").innerHTML = CONFIG.agenda.map((day) => `
      <section class="day-col">
        <div class="day-head"><strong>${day.day}</strong><span>${day.items.length} checkpoints</span></div>
        ${day.items.map((item) => {
          const cp = checkpointById(item.checkpointId);
          return `<button class="day-item ${cp.category || "command"}" data-checkpoint-id="${item.checkpointId}">
            <small>${escapeHtml(item.time)}</small>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.subtitle || cp.output)}</p>
          </button>`;
        }).join("")}
      </section>
    `).join("");
    $$("#weekGrid .day-item").forEach((btn) => btn.addEventListener("click", () => startCheckpoint(btn.dataset.checkpointId)));
  }

  function startCheckpoint(checkpointId) {
    const cp = checkpointById(checkpointId);
    const custom = state.customTopics[checkpointId] || [];
    state.active = {
      id: uid("session"),
      checkpointId,
      title: cp.title,
      startedAt: new Date().toISOString(),
      date: todayISO(),
      time: currentTime(),
      status: "Verde",
      participants: cp.participants || "",
      context: "",
      topics: [...(cp.topics || []), ...custom].map((title) => ({ id: uid("topic"), title, status: "Aberto", notes: "" })),
      kpis: [{ id: uid("kpi"), name: "", value: "", status: "Verde", deviation: "", action: "", owner: "", due: "" }],
      answers: (cp.questions || []).map((question) => ({ id: uid("answer"), question, fact: "", impact: "", proposal: "", owner: "", due: "" })),
      actions: [],
      culture: {},
      close: { decision: "", owner: "", due: "", metric: "", nextReview: "", audience: "Equipa local", phrase: "" }
    };
    saveState();
    openTab("checkpoint");
    renderCheckpoint();
    toast(`Checkpoint iniciado: ${cp.title}`);
  }

  function renderCheckpoint() {
    if (!state.active) {
      $("#checkpointEmpty").classList.remove("hidden");
      $("#checkpointWorkspace").classList.add("hidden");
      return;
    }
    const session = state.active;
    const cp = checkpointById(session.checkpointId);
    $("#checkpointEmpty").classList.add("hidden");
    $("#checkpointWorkspace").classList.remove("hidden");
    $("#activeCheckpointMeta").textContent = `${cp.day} ${cp.time} · ${cp.type === "meeting" ? "Reunião" : "Checkpoint"}`;
    $("#activeCheckpointTitle").textContent = cp.title;
    $("#activeCheckpointObjective").textContent = cp.objective;
    $("#sessionStatus").value = session.status || "Verde";
    $("#sessionParticipants").value = session.participants || "";
    $("#sessionDate").value = session.date || todayISO();
    $("#sessionTime").value = session.time || currentTime();
    $("#sessionContext").value = session.context || "";
    $("#closeDecision").value = session.close?.decision || "";
    $("#closeOwner").value = session.close?.owner || "";
    $("#closeDue").value = session.close?.due || "";
    $("#closeMetric").value = session.close?.metric || "";
    $("#closeNextReview").value = session.close?.nextReview || "";
    $("#closeAudience").value = session.close?.audience || "Equipa local";
    $("#leadershipPhrase").value = session.close?.phrase || "";
    $("#validationBox").classList.add("hidden");

    renderTopics();
    renderKpis();
    renderQuestions();
    renderSessionActions();
    renderCultureChecklist();
    bindActiveAutosave();
  }

  function bindActiveAutosave() {
    ["#sessionStatus", "#sessionParticipants", "#sessionDate", "#sessionTime", "#sessionContext", "#closeDecision", "#closeOwner", "#closeDue", "#closeMetric", "#closeNextReview", "#closeAudience", "#leadershipPhrase"].forEach((selector) => {
      const el = $(selector);
      el.oninput = () => { collectActiveFromDOM(); saveState(); };
      el.onchange = () => { collectActiveFromDOM(); saveState(); };
    });
  }

  function collectActiveFromDOM() {
    const session = state.active;
    if (!session) return;
    session.status = $("#sessionStatus").value;
    session.participants = $("#sessionParticipants").value.trim();
    session.date = $("#sessionDate").value || todayISO();
    session.time = $("#sessionTime").value || currentTime();
    session.context = $("#sessionContext").value.trim();
    session.close = {
      decision: $("#closeDecision").value.trim(),
      owner: $("#closeOwner").value.trim(),
      due: $("#closeDue").value,
      metric: $("#closeMetric").value.trim(),
      nextReview: $("#closeNextReview").value,
      audience: $("#closeAudience").value,
      phrase: $("#leadershipPhrase").value.trim()
    };
  }

  function renderTopics() {
    const container = $("#topicsList");
    container.innerHTML = state.active.topics.map((topic, index) => `
      <div class="topic-card" data-topic-index="${index}">
        <div class="topic-head">
          <span class="topic-title">${escapeHtml(topic.title)}</span>
          <button class="ghost remove-topic" data-index="${index}">Remover</button>
        </div>
        <div class="small-grid">
          <label>Estado
            <select class="topic-status">
              ${["Aberto", "Em decisão", "Ação criada", "Escalado", "Fechado"].map((s) => `<option ${topic.status === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </label>
          <label>Notas / pontos-chave
            <input class="topic-notes" value="${escapeHtml(topic.notes || "")}" placeholder="Número, desvio, risco ou decisão" />
          </label>
        </div>
      </div>`).join("");
    $$(".remove-topic", container).forEach((btn) => btn.addEventListener("click", () => { state.active.topics.splice(Number(btn.dataset.index), 1); saveState(); renderTopics(); }));
    $$(".topic-card", container).forEach((card) => {
      const i = Number(card.dataset.topicIndex);
      card.querySelector(".topic-status").addEventListener("change", (e) => { state.active.topics[i].status = e.target.value; saveState(); });
      card.querySelector(".topic-notes").addEventListener("input", (e) => { state.active.topics[i].notes = e.target.value; saveState(); });
    });
  }

  function addTopic() {
    const title = prompt("Novo tópico do checkpoint:");
    if (!title) return;
    state.active.topics.push({ id: uid("topic"), title: title.trim(), status: "Aberto", notes: "" });
    saveState();
    renderTopics();
  }

  function renderKpis() {
    const container = $("#kpiList");
    container.innerHTML = state.active.kpis.map((kpi, index) => {
      const statusClass = kpi.status === "Vermelho" ? "red" : kpi.status === "Amarelo" ? "yellow" : "green";
      return `<div class="kpi-card ${statusClass}" data-kpi-index="${index}">
        <div class="section-head">
          <h4>KPI ${index + 1}</h4>
          <button class="ghost remove-kpi" data-index="${index}">Remover</button>
        </div>
        <div class="form-grid">
          <label>Nome do KPI<input class="kpi-name" value="${escapeHtml(kpi.name || "")}" placeholder="Ex.: OTD, OEE, output, lead time" /></label>
          <label>Valor / número<input class="kpi-value" value="${escapeHtml(kpi.value || "")}" placeholder="Ex.: 87%, 12 pedidos bloqueados" /></label>
          <label>Estado<select class="kpi-status">${["Verde", "Amarelo", "Vermelho"].map((s) => `<option ${kpi.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>
          <label>Desvio / causa provável<input class="kpi-deviation" value="${escapeHtml(kpi.deviation || "")}" placeholder="O que está fora do plano?" /></label>
          <label>Ação obrigatória<input class="kpi-action" value="${escapeHtml(kpi.action || "")}" placeholder="Que ação recupera o desvio?" /></label>
          <label>Dono<input class="kpi-owner" value="${escapeHtml(kpi.owner || "")}" placeholder="Dono nominal" /></label>
          <label>Prazo<input class="kpi-due" type="date" value="${escapeHtml(kpi.due || "")}" /></label>
        </div>
      </div>`;
    }).join("");
    $$(".remove-kpi", container).forEach((btn) => btn.addEventListener("click", () => { state.active.kpis.splice(Number(btn.dataset.index), 1); saveState(); renderKpis(); }));
    $$(".kpi-card", container).forEach((card) => bindKpiCard(card));
  }

  function bindKpiCard(card) {
    const i = Number(card.dataset.kpiIndex);
    const update = (e) => {
      const k = state.active.kpis[i];
      k.name = card.querySelector(".kpi-name").value.trim();
      k.value = card.querySelector(".kpi-value").value.trim();
      k.status = card.querySelector(".kpi-status").value;
      k.deviation = card.querySelector(".kpi-deviation").value.trim();
      k.action = card.querySelector(".kpi-action").value.trim();
      k.owner = card.querySelector(".kpi-owner").value.trim();
      k.due = card.querySelector(".kpi-due").value;
      saveState();
      if (e?.target?.classList?.contains("kpi-status")) renderKpis();
    };
    $$('input, textarea, select', card).forEach((el) => { el.addEventListener("input", update); el.addEventListener("change", update); });
  }

  function addKpi() {
    state.active.kpis.push({ id: uid("kpi"), name: "", value: "", status: "Verde", deviation: "", action: "", owner: "", due: "" });
    saveState();
    renderKpis();
  }

  function renderQuestions() {
    const container = $("#questionsList");
    container.innerHTML = state.active.answers.map((answer, index) => `
      <div class="question-card" data-answer-index="${index}">
        <h4>${escapeHtml(answer.question)}</h4>
        <div class="form-grid">
          <label>Facto / número<textarea class="answer-fact" placeholder="Facto + número">${escapeHtml(answer.fact || "")}</textarea></label>
          <label>Impacto<textarea class="answer-impact" placeholder="Cliente, prazo, qualidade, custo, EBITDA ou cultura">${escapeHtml(answer.impact || "")}</textarea></label>
          <label>Proposta / ação<textarea class="answer-proposal" placeholder="O que vamos fazer?">${escapeHtml(answer.proposal || "")}</textarea></label>
          <label>Dono<input class="answer-owner" value="${escapeHtml(answer.owner || "")}" placeholder="Dono nominal" /></label>
          <label>Prazo<input class="answer-due" type="date" value="${escapeHtml(answer.due || "")}" /></label>
        </div>
        <button class="secondary create-action-from-answer" data-index="${index}">Criar ação desta resposta</button>
      </div>`).join("");
    $$(".question-card", container).forEach((card) => bindQuestionCard(card));
    $$(".create-action-from-answer", container).forEach((btn) => btn.addEventListener("click", () => createActionFromAnswer(Number(btn.dataset.index))));
  }

  function bindQuestionCard(card) {
    const i = Number(card.dataset.answerIndex);
    const update = () => {
      const a = state.active.answers[i];
      a.fact = card.querySelector(".answer-fact").value.trim();
      a.impact = card.querySelector(".answer-impact").value.trim();
      a.proposal = card.querySelector(".answer-proposal").value.trim();
      a.owner = card.querySelector(".answer-owner").value.trim();
      a.due = card.querySelector(".answer-due").value;
      saveState();
    };
    $$('input, textarea, select', card).forEach((el) => { el.addEventListener("input", update); el.addEventListener("change", update); });
  }

  function createActionFromAnswer(index) {
    const a = state.active.answers[index];
    if (!a.proposal && !a.fact) {
      toast("Não há conteúdo suficiente para criar ação.");
      return;
    }
    state.active.actions.push({
      id: uid("action"),
      title: a.proposal || a.fact,
      owner: a.owner || "",
      due: a.due || "",
      impact: a.impact || "",
      source: state.active.title,
      priority: "Normal",
      status: "Aberta",
      createdAt: new Date().toISOString()
    });
    saveState();
    renderSessionActions();
    toast("Ação criada a partir do playbook.");
  }

  function renderSessionActions() {
    const container = $("#sessionActionsList");
    container.innerHTML = state.active.actions.length ? state.active.actions.map((a, i) => actionHtml(a, i, "session")).join("") : `<p class="muted">Ainda não há ações criadas neste checkpoint.</p>`;
    bindActionCardEvents(container);
  }

  function showActionEditor(scope, action = null, index = null) {
    const isEdit = !!action;
    const item = action || { title: "", owner: "", due: "", impact: "", priority: "Normal", status: "Aberta", source: state.active?.title || "Manual" };
    showModal(isEdit ? "Editar ação" : "Nova ação", `
      <div class="form-grid">
        <label>Ação<input id="modalActionTitle" value="${escapeHtml(item.title)}" placeholder="Ação concreta" /></label>
        <label>Dono<input id="modalActionOwner" value="${escapeHtml(item.owner)}" placeholder="Dono nominal" /></label>
        <label>Prazo<input id="modalActionDue" type="date" value="${escapeHtml(item.due)}" /></label>
        <label>Prioridade<select id="modalActionPriority">${["Normal", "Alta", "Crítica"].map((p) => `<option ${item.priority === p ? "selected" : ""}>${p}</option>`).join("")}</select></label>
        <label>Estado<select id="modalActionStatus">${["Aberta", "Em curso", "Bloqueada", "Escalada", "Fechada"].map((s) => `<option ${item.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Impacto<input id="modalActionImpact" value="${escapeHtml(item.impact)}" placeholder="Cliente, prazo, custo, EBITDA, cultura" /></label>
      </div>
    `, () => {
      const updated = {
        ...item,
        id: item.id || uid("action"),
        title: $("#modalActionTitle").value.trim(),
        owner: $("#modalActionOwner").value.trim(),
        due: $("#modalActionDue").value,
        priority: $("#modalActionPriority").value,
        status: $("#modalActionStatus").value,
        impact: $("#modalActionImpact").value.trim(),
        source: item.source || state.active?.title || "Manual",
        createdAt: item.createdAt || new Date().toISOString()
      };
      if (!updated.title) { toast("Ação precisa de descrição."); return false; }
      if (scope === "session") {
        if (isEdit) state.active.actions[index] = updated;
        else state.active.actions.push(updated);
        saveState();
        renderSessionActions();
      } else {
        if (isEdit) state.actions[index] = updated;
        else state.actions.unshift(updated);
        saveState();
        renderActions();
        renderToday();
      }
      toast(isEdit ? "Ação atualizada." : "Ação criada.");
      return true;
    });
  }

  function actionHtml(action, index = null, scope = "global") {
    const overdue = isOverdue(action);
    const critical = action.priority === "Crítica";
    return `<div class="action-card ${overdue ? "overdue" : ""} ${critical ? "critical" : ""}" data-action-index="${index}" data-action-scope="${scope}">
      <div class="action-top">
        <div>
          <div class="action-title">${escapeHtml(action.title || "Ação sem descrição")}</div>
          <div class="action-meta">
            <span>Dono: ${escapeHtml(action.owner || "SEM DONO")}</span>
            <span>Prazo: ${formatDate(action.due)}</span>
            <span>${escapeHtml(action.status || "Aberta")}</span>
            <span>${escapeHtml(action.priority || "Normal")}</span>
          </div>
        </div>
        <span class="pill ${overdue ? "status-Vermelho" : ""}">${overdue ? "Atrasada" : escapeHtml(action.source || "Manual")}</span>
      </div>
      <p class="muted">${escapeHtml(action.impact || "Sem impacto registado")}</p>
      <div class="button-row">
        <button class="ghost edit-action">Editar</button>
        <button class="secondary close-action">Fechar</button>
        <button class="danger-outline delete-action">Eliminar</button>
      </div>
    </div>`;
  }

  function bindActionCardEvents(root = document) {
    $$(".edit-action", root).forEach((btn) => btn.addEventListener("click", () => {
      const card = btn.closest(".action-card");
      const index = Number(card.dataset.actionIndex);
      const scope = card.dataset.actionScope;
      const action = scope === "session" ? state.active.actions[index] : filteredActions()[index] || state.actions[index];
      const realIndex = scope === "session" ? index : state.actions.findIndex((a) => a.id === action.id);
      showActionEditor(scope, action, realIndex);
    }));
    $$(".close-action", root).forEach((btn) => btn.addEventListener("click", () => {
      const card = btn.closest(".action-card");
      const index = Number(card.dataset.actionIndex);
      const scope = card.dataset.actionScope;
      if (scope === "session") state.active.actions[index].status = "Fechada";
      else {
        const action = filteredActions()[index] || state.actions[index];
        const realIndex = state.actions.findIndex((a) => a.id === action.id);
        state.actions[realIndex].status = "Fechada";
      }
      saveState(); renderSessionActions(); renderActions(); renderToday(); toast("Ação fechada.");
    }));
    $$(".delete-action", root).forEach((btn) => btn.addEventListener("click", () => {
      const card = btn.closest(".action-card");
      const index = Number(card.dataset.actionIndex);
      const scope = card.dataset.actionScope;
      if (!confirm("Eliminar esta ação?")) return;
      if (scope === "session") state.active.actions.splice(index, 1);
      else {
        const action = filteredActions()[index] || state.actions[index];
        state.actions = state.actions.filter((a) => a.id !== action.id);
      }
      saveState(); renderSessionActions(); renderActions(); renderToday();
    }));
  }

  function renderCultureChecklist() {
    const container = $("#cultureList");
    container.innerHTML = CONFIG.culturalSignals.map((signal) => {
      const item = state.active.culture[signal.id] || { checked: false, notes: "" };
      return `<div class="culture-item ${signal.type}">
        <label><input type="checkbox" class="culture-check" data-id="${signal.id}" ${item.checked ? "checked" : ""}/> <strong>${escapeHtml(signal.label)}</strong></label>
        <p class="muted">${escapeHtml(signal.prompt)}</p>
        <input class="culture-notes" data-id="${signal.id}" value="${escapeHtml(item.notes || "")}" placeholder="Observação" />
      </div>`;
    }).join("");
    $$(".culture-check", container).forEach((el) => el.addEventListener("change", updateCulture));
    $$(".culture-notes", container).forEach((el) => el.addEventListener("input", updateCulture));
  }

  function updateCulture(e) {
    const id = e.target.dataset.id;
    const check = $(`.culture-check[data-id="${id}"]`).checked;
    const notes = $(`.culture-notes[data-id="${id}"]`).value.trim();
    state.active.culture[id] = { checked: check, notes };
    saveState();
  }

  function validateActive() {
    collectActiveFromDOM();
    const s = state.active;
    const errors = [];
    const c = CONFIG.validationMessages;
    if (!s.close.decision) errors.push(c.noDecision);
    if (!s.close.owner) errors.push("Fecho obrigatório: falta dono nominal.");
    if (!s.close.due) errors.push(c.actionNoDue);
    if (!s.close.metric) errors.push(c.noClosureMetric);
    if (!s.close.nextReview) errors.push(c.noNextReview);

    s.kpis.forEach((k, idx) => {
      if ((k.status === "Vermelho") && (!k.action || !k.owner || !k.due)) {
        errors.push(`KPI ${idx + 1} (${k.name || "sem nome"}): ${c.redKpiNoPlan}`);
      }
    });
    s.actions.forEach((a, idx) => {
      if (a.status !== "Fechada") {
        if (!a.title) errors.push(`Ação ${idx + 1}: falta descrição.`);
        if (!a.owner) errors.push(`Ação ${idx + 1}: ${c.actionNoOwner}`);
        if (!a.due) errors.push(`Ação ${idx + 1}: ${c.actionNoDue}`);
      }
    });
    if (s.close.audience && s.close.audience !== "Nenhuma" && !s.close.decision) errors.push(c.escalationNoRecommendation);
    return errors;
  }

  function validateAndShow() {
    const errors = validateActive();
    const box = $("#validationBox");
    if (!errors.length) {
      box.classList.remove("hidden");
      box.style.background = "var(--success-bg)";
      box.style.color = "var(--success)";
      box.innerHTML = "Fecho validado. Podes gerar ata e relatório.";
      toast("Fecho validado.");
      return true;
    }
    box.classList.remove("hidden");
    box.style.background = "var(--red-bg)";
    box.style.color = "var(--red)";
    box.innerHTML = `<strong>Bloqueios de fecho:</strong><ul>${errors.map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ul>`;
    toast("Existem bloqueios de fecho.");
    return false;
  }

  function closeCheckpoint() {
    if (!state.active) return;
    if (!validateAndShow()) return;
    collectActiveFromDOM();
    const session = JSON.parse(JSON.stringify(state.active));
    session.closedAt = new Date().toISOString();
    session.finished = true;

    const minutes = generateMinutes(session);
    const executive = generateExecutiveReport(session);
    const followup = generateFollowup(session);
    const report = {
      id: uid("report"),
      checkpointId: session.checkpointId,
      title: session.title,
      date: session.date,
      status: session.status,
      minutes,
      executive,
      followup,
      session
    };
    state.reports.unshift(report);
    session.actions.forEach((action) => state.actions.unshift({ ...action, source: session.title, checkpointReportId: report.id }));
    state.active = null;
    selectedReportId = report.id;
    saveState();
    renderAll();
    openTab("reports");
    toast("Checkpoint fechado. Ata e relatório gerados.");
  }

  function discardDraft() {
    if (!state.active) return;
    if (!confirm("Descartar o checkpoint atual?")) return;
    state.active = null;
    saveState();
    renderCheckpoint();
    toast("Rascunho descartado.");
  }

  function generateMinutes(session) {
    const cp = checkpointById(session.checkpointId);
    const kpis = session.kpis.filter((k) => k.name || k.value || k.deviation || k.action);
    const topics = session.topics.filter((t) => t.notes || t.status !== "Aberto");
    const answers = session.answers.filter((a) => a.fact || a.impact || a.proposal || a.owner || a.due);
    const culture = CONFIG.culturalSignals
      .map((signal) => ({ signal, item: session.culture[signal.id] }))
      .filter((x) => x.item?.checked || x.item?.notes);

    return `# ATA LÁZARO — ${session.title}

**Data:** ${formatDate(session.date)}  
**Hora:** ${session.time || ""}  
**Estado geral:** ${session.status}  
**Participantes:** ${session.participants || "Não registado"}  
**Objetivo:** ${cp.objective}

## 1. Contexto objetivo
${session.context || "Não registado."}

## 2. Números / KPIs
${kpis.length ? kpis.map((k) => `- **${k.name || "KPI"}:** ${k.value || "sem valor"} | Estado: ${k.status} | Desvio: ${k.deviation || "n/a"} | Ação: ${k.action || "n/a"} | Dono: ${k.owner || "n/a"} | Prazo: ${formatDate(k.due)}`).join("\n") : "- Sem KPIs registados."}

## 3. Tópicos abordados
${topics.length ? topics.map((t) => `- **${t.title}:** ${t.status}. ${t.notes || ""}`).join("\n") : "- Sem tópicos adicionais registados."}

## 4. Perguntas de comando e decisões intermédias
${answers.length ? answers.map((a) => `### ${a.question}\n- Facto: ${a.fact || "n/a"}\n- Impacto: ${a.impact || "n/a"}\n- Proposta: ${a.proposal || "n/a"}\n- Dono: ${a.owner || "n/a"}\n- Prazo: ${formatDate(a.due)}`).join("\n\n") : "Sem respostas detalhadas registadas."}

## 5. Ações abertas
${session.actions.length ? session.actions.map((a) => `- [${a.status}] ${a.title} | Dono: ${a.owner || "SEM DONO"} | Prazo: ${formatDate(a.due)} | Impacto: ${a.impact || "n/a"}`).join("\n") : "- Sem ações criadas neste checkpoint."}

## 6. Radar cultural
${culture.length ? culture.map(({ signal, item }) => `- **${signal.label}** (${signal.type === "risk" ? "risco" : "positivo"}): ${item.notes || "assinalado"}`).join("\n") : "- Sem sinais culturais registados."}

## 7. Fecho obrigatório
- **Decisão tomada:** ${session.close.decision}
- **Dono nominal:** ${session.close.owner}
- **Prazo:** ${formatDate(session.close.due)}
- **Indicador de fecho:** ${session.close.metric}
- **Próxima revisão:** ${formatDate(session.close.nextReview)}
- **Comunicação necessária:** ${session.close.audience}

## 8. Frase de liderança
> ${session.close.phrase || "Cada desvio tem dono, prazo e plano."}
`;
  }

  function generateExecutiveReport(session) {
    const kpis = session.kpis.filter((k) => k.name || k.value || k.deviation || k.action);
    const risks = [];
    session.kpis.forEach((k) => { if (k.status === "Vermelho" || k.status === "Amarelo") risks.push(`${k.name || "KPI"}: ${k.deviation || k.value || k.status}`); });
    session.actions.forEach((a) => { if (a.priority === "Crítica" || a.status === "Bloqueada" || a.status === "Escalada") risks.push(`${a.title} (${a.status})`); });
    return `# RELATÓRIO EXECUTIVO — ${session.title}

**Estado geral:** ${session.status}  
**Data:** ${formatDate(session.date)}  
**Mensagem:** ${session.close.phrase || "Nenhum tema crítico fica sem dono."}

## 1. Performance / números
${kpis.length ? kpis.slice(0, 5).map((k) => `- ${k.name || "KPI"}: ${k.value || "sem valor"} (${k.status})`).join("\n") : "- Sem KPIs registados."}

## 2. Top desvios / riscos
${risks.length ? risks.slice(0, 5).map((r) => `- ${r}`).join("\n") : "- Sem riscos críticos registados."}

## 3. Decisão tomada
${session.close.decision}

## 4. Ações críticas
${session.actions.length ? session.actions.slice(0, 5).map((a) => `- ${a.title} | Dono: ${a.owner || "SEM DONO"} | Prazo: ${formatDate(a.due)}`).join("\n") : "- Sem ações criadas."}

## 5. Pedido / comunicação
Destino: ${session.close.audience}.  
Próxima revisão: ${formatDate(session.close.nextReview)}.  
Indicador de fecho: ${session.close.metric}.
`;
  }

  function generateFollowup(session) {
    return `Assunto: Walter FMT — Follow-up — ${session.title}

Bom dia,

Conforme alinhado, ficam registados os pontos principais do checkpoint/reunião ${session.title}.

Estado geral: ${session.status}

Decisão tomada:
${session.close.decision}

Ações abertas:
${session.actions.length ? session.actions.map((a) => `- ${a.title} | Dono: ${a.owner || "SEM DONO"} | Prazo: ${formatDate(a.due)} | Impacto: ${a.impact || "n/a"}`).join("\n") : "- Sem ações criadas."}

Próxima revisão: ${formatDate(session.close.nextReview)}
Indicador de fecho: ${session.close.metric}

Regra de trabalho: cada desvio fica com ação, dono, prazo e fecho.

Cumprimentos,
Fábio`;
  }

  function filteredActions() {
    const list = [...state.actions];
    if (actionFilter === "all") return list;
    if (actionFilter === "open") return list.filter((a) => a.status !== "Fechada");
    if (actionFilter === "overdue") return list.filter(isOverdue);
    if (actionFilter === "critical") return list.filter((a) => a.priority === "Crítica" || a.status === "Escalada" || a.status === "Bloqueada");
    if (actionFilter === "closed") return list.filter((a) => a.status === "Fechada");
    return list;
  }

  function renderActions() {
    const list = filteredActions();
    $("#actionsBoard").innerHTML = list.length ? list.map((a, i) => actionHtml(a, i, "global")).join("") : `<p class="muted">Sem ações neste filtro.</p>`;
    bindActionCardEvents($("#actionsBoard"));
  }

  function renderRadar() {
    const counts = {};
    CONFIG.culturalSignals.forEach((s) => { counts[s.id] = 0; });
    state.reports.forEach((report) => {
      const culture = report.session?.culture || {};
      Object.entries(culture).forEach(([id, item]) => { if (item.checked || item.notes) counts[id] = (counts[id] || 0) + 1; });
    });
    $("#radarStats").innerHTML = CONFIG.culturalSignals.map((signal) => `
      <div class="radar-card ${signal.type}">
        <strong>${counts[signal.id] || 0}</strong>
        <div>${escapeHtml(signal.label)}</div>
        <p class="muted">${escapeHtml(signal.prompt)}</p>
      </div>`).join("");
  }

  function generateCultureReport() {
    const riskSignals = [];
    const positiveSignals = [];
    state.reports.slice(0, 20).forEach((report) => {
      CONFIG.culturalSignals.forEach((signal) => {
        const item = report.session?.culture?.[signal.id];
        if (item?.checked || item?.notes) {
          const line = `${report.title} (${formatDate(report.date)}): ${signal.label}${item.notes ? ` — ${item.notes}` : ""}`;
          if (signal.type === "risk") riskSignals.push(line);
          else positiveSignals.push(line);
        }
      });
    });
    const text = `# SÍNTESE CULTURAL WALTER FMT

## Sinais positivos a multiplicar
${positiveSignals.length ? positiveSignals.map((x) => `- ${x}`).join("\n") : "- Sem sinais positivos registados."}

## Riscos culturais a corrigir
${riskSignals.length ? riskSignals.map((x) => `- ${x}`).join("\n") : "- Sem riscos culturais registados."}

## Mensagem de liderança
O que toleramos vira norma. O que cobramos com justiça vira cultura.`;
    const box = $("#cultureReport");
    box.textContent = text;
    box.classList.remove("hidden");
  }

  function renderReports() {
    const list = state.reports;
    if (!selectedReportId && list[0]) selectedReportId = list[0].id;
    $("#reportsList").innerHTML = list.length ? list.map((r) => `
      <button class="report-row ${r.id === selectedReportId ? "active" : ""}" data-report-id="${r.id}">
        <strong>${escapeHtml(r.title)}</strong>
        <span>${formatDate(r.date)} · ${escapeHtml(r.status)}</span>
      </button>`).join("") : `<p class="muted">Ainda não há reports. Fecha um checkpoint para gerar ata.</p>`;
    $$(".report-row", $("#reportsList")).forEach((btn) => btn.addEventListener("click", () => { selectedReportId = btn.dataset.reportId; renderReports(); }));
    const report = state.reports.find((r) => r.id === selectedReportId);
    $("#reportOutput").textContent = report ? `${report.minutes}\n\n---\n\n${report.executive}\n\n---\n\n${report.followup}` : "Seleciona uma ata/report.";
  }

  function selectedReportText() {
    const report = state.reports.find((r) => r.id === selectedReportId);
    if (!report) return "";
    return `${report.minutes}\n\n---\n\n${report.executive}\n\n---\n\n${report.followup}`;
  }

  async function copySelectedReport() {
    const text = selectedReportText();
    if (!text) return toast("Sem report selecionado.");
    await navigator.clipboard.writeText(text);
    toast("Report copiado.");
  }

  async function shareSelectedReport() {
    const text = selectedReportText();
    if (!text) return toast("Sem report selecionado.");
    if (navigator.share) {
      try { await navigator.share({ title: "FMT Command Cockpit Report", text }); }
      catch (err) { console.warn(err); }
    } else {
      await navigator.clipboard.writeText(text);
      toast("Partilha não disponível. Copiei o report.");
    }
  }

  function downloadSelectedReport() {
    const text = selectedReportText();
    if (!text) return toast("Sem report selecionado.");
    downloadText(`fmt-report-${todayISO()}.md`, text);
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportAllData() {
    downloadText(`fmt-command-cockpit-data-${todayISO()}.json`, JSON.stringify(state, null, 2));
  }

  function toggleImportData() {
    const area = $("#importDataArea");
    if (area.classList.contains("hidden")) {
      area.classList.remove("hidden");
      $("#importDataBtn").textContent = "Confirmar importação";
      toast("Cola o JSON exportado na caixa.");
    } else {
      try {
        const imported = JSON.parse(area.value);
        state = { ...defaultState(), ...imported };
        saveState();
        area.value = "";
        area.classList.add("hidden");
        $("#importDataBtn").textContent = "Importar JSON";
        renderAll();
        toast("Dados importados.");
      } catch (e) {
        toast("JSON inválido.");
      }
    }
  }

  function saveCustomTopic() {
    const cpId = $("#configCheckpointSelect").value;
    const topic = $("#configTopicInput").value.trim();
    if (!topic) return toast("Escreve um tópico.");
    state.customTopics[cpId] = state.customTopics[cpId] || [];
    state.customTopics[cpId].push(topic);
    $("#configTopicInput").value = "";
    saveState();
    renderConfig();
    toast("Tópico recorrente adicionado.");
  }

  function renderConfig() {
    const container = $("#customTopicsList");
    const entries = Object.entries(state.customTopics).flatMap(([cpId, topics]) => topics.map((t, i) => ({ cpId, title: t, index: i })));
    container.innerHTML = entries.length ? entries.map((entry) => `<div class="topic-card">
      <div class="topic-head"><span><strong>${escapeHtml(checkpointById(entry.cpId).title)}</strong><br>${escapeHtml(entry.title)}</span><button class="danger-outline remove-custom-topic" data-cp-id="${entry.cpId}" data-index="${entry.index}">Remover</button></div>
    </div>`).join("") : `<p class="muted">Sem tópicos recorrentes adicionados.</p>`;
    $$(".remove-custom-topic", container).forEach((btn) => btn.addEventListener("click", () => {
      state.customTopics[btn.dataset.cpId].splice(Number(btn.dataset.index), 1);
      saveState(); renderConfig();
    }));
  }

  function clearLocalData() {
    if (!confirm("Limpar todos os dados locais? Exporta antes se quiseres manter histórico.")) return;
    state = defaultState();
    saveState();
    renderAll();
    toast("Dados locais limpos.");
  }

  function showModal(title, bodyHtml, onOk = null) {
    const modal = $("#modal");
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = bodyHtml;
    const ok = $("#modalOkBtn");
    const cancel = $("#modalCancelBtn");
    ok.onclick = () => {
      if (onOk) {
        const shouldClose = onOk();
        if (shouldClose === false) return;
      }
      modal.close();
    };
    cancel.onclick = () => modal.close();
    modal.showModal();
  }

  init();
})();
