const plans = {
  landing:  { name: "Landing Page", base: 1290000, pages: 1, time: "3–5 ngày" },
  business: { name: "Website Doanh nghiệp", base: 2490000, pages: 5, time: "5–10 ngày" },
  catalog:  { name: "Catalog Bán hàng", base: 3490000, pages: 5, time: "7–14 ngày" },
  custom:   { name: "Custom / Interactive", base: null, pages: 1, time: "Đánh giá theo dự án" }
};

const FORM_ENDPOINT = "https://formsubmit.co/ajax/minhquanhangtran@gmail.com";

let current = "landing";
let pages = 1;

const q = selector => document.querySelector(selector);
const qa = selector => [...document.querySelectorAll(selector)];
const fmt = number => new Intl.NumberFormat("vi-VN").format(number) + "đ";

function getEstimateState() {
  const plan = plans[current];
  const checked = qa(".addons input:checked");
  const addonNames = checked.map(el => el.dataset.name);
  const addonCost = checked.reduce((sum, el) => sum + Number(el.dataset.price || 0), 0);

  if (plan.base === null) {
    return {
      plan,
      addonNames,
      priceText: "Cần tư vấn",
      total: null
    };
  }

  const extraPages = Math.max(0, pages - plan.pages) * 300000;
  const total = plan.base + extraPages + addonCost;

  return {
    plan,
    addonNames,
    total,
    priceText: fmt(total)
  };
}

function updateBriefEstimate() {
  const target = q("#briefEstimate");
  if (!target) return;
  const state = getEstimateState();
  const addons = state.addonNames.length ? " · +" + state.addonNames.length + " tính năng" : "";
  target.textContent = `${state.plan.name} · ${pages} trang · ${state.priceText}${addons}`;
}

function setPlan(key, shouldScroll = true) {
  if (!plans[key]) return;
  current = key;
  pages = plans[key].pages;
  qa(".plan").forEach(el => el.classList.toggle("active", el.dataset.plan === key));
  update();
  if (shouldScroll) q("#quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function update() {
  const state = getEstimateState();

  q("#pages").textContent = pages;
  q("#summaryPages").textContent = pages;
  q("#summaryPlan").textContent = state.plan.name;
  q("#estimateBadge").textContent = state.plan.name.toUpperCase();
  q("#estimateRange").textContent = "Thời gian dự kiến: " + state.plan.time;
  q("#summaryAddons").textContent = state.addonNames.length ? state.addonNames.join(", ") : "Chưa chọn";
  q("#estimatePrice").textContent = state.priceText;

  updateBriefEstimate();
}

qa(".plan").forEach(el => el.addEventListener("click", () => setPlan(el.dataset.plan)));
qa("[data-plan]:not(.plan)").forEach(el => el.addEventListener("click", () => setPlan(el.dataset.plan)));

q("#minus")?.addEventListener("click", () => {
  pages = Math.max(1, pages - 1);
  update();
});

q("#plus")?.addEventListener("click", () => {
  pages = Math.min(30, pages + 1);
  update();
});

qa(".addons input").forEach(el => el.addEventListener("change", update));

q("#copyRequest")?.addEventListener("click", async () => {
  const state = getEstimateState();
  const addons = state.addonNames.length ? state.addonNames.join(", ") : "chưa chọn";
  const text = `Xin chào Quân Dev, tôi muốn được tư vấn ${state.plan.name}. Số trang dự kiến: ${pages}. Tính năng thêm: ${addons}. Dự toán trên website: ${state.priceText}. Tôi muốn trao đổi thêm về mục tiêu và phạm vi dự án.`;

  try {
    await navigator.clipboard.writeText(text);
    q("#copyNote").textContent = "✓ Đã sao chép yêu cầu tư vấn";
    setTimeout(() => q("#copyNote").textContent = "", 2500);
  } catch {
    window.prompt("Sao chép nội dung này:", text);
  }
});

function buildBrief() {
  const state = getEstimateState();
  const value = id => q(id)?.value.trim() || "Chưa cung cấp";

  return `YÊU CẦU TƯ VẤN WEBSITE - QUÂN DEV

Tên / doanh nghiệp: ${value("#clientName")}
Email: ${value("#clientEmail")}
Điện thoại / Zalo: ${value("#clientPhone")}
Lĩnh vực: ${value("#businessType")}
Mục tiêu: ${q("#goal")?.value || "Chưa cung cấp"}
Ngân sách dự kiến: ${q("#budget")?.value || "Chưa xác định"}
Deadline mong muốn: ${value("#deadline")}

Dự toán đang chọn:
- Gói: ${state.plan.name}
- Số trang: ${pages}
- Tính năng thêm: ${state.addonNames.length ? state.addonNames.join(", ") : "Chưa chọn"}
- Dự toán: ${state.priceText}

Mô tả thêm:
${value("#briefNote")}`;
}

function setBriefStatus(message, type = "") {
  const status = q("#briefStatus");
  if (!status) return;
  status.textContent = message;
  status.className = `brief-status ${type}`.trim();
}

q("#copyBrief")?.addEventListener("click", async () => {
  const text = buildBrief();
  try {
    await navigator.clipboard.writeText(text);
    setBriefStatus("✓ Đã sao chép brief. Bạn có thể gửi qua Zalo nếu muốn.", "success");
  } catch {
    window.prompt("Sao chép brief này:", text);
  }
});

q("#briefForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = q("#submitBrief");
  const buttonText = submitButton?.querySelector("span");

  if (!form.checkValidity()) {
    form.reportValidity();
    setBriefStatus("Vui lòng điền các ô bắt buộc trước khi gửi.", "error");
    return;
  }

  if (q("#websiteField")?.value) return;

  const state = getEstimateState();
  const payload = new FormData();

  payload.append("_subject", `Yêu cầu website mới - ${q("#clientName").value.trim()} - Quân Dev`);
  payload.append("_template", "table");
  payload.append("_captcha", "false");
  payload.append("Tên / doanh nghiệp", q("#clientName").value.trim());
  payload.append("Email khách hàng", q("#clientEmail").value.trim());
  payload.append("Điện thoại / Zalo", q("#clientPhone").value.trim());
  payload.append("Lĩnh vực", q("#businessType").value.trim());
  payload.append("Mục tiêu", q("#goal").value);
  payload.append("Ngân sách", q("#budget").value);
  payload.append("Deadline", q("#deadline").value.trim() || "Chưa xác định");
  payload.append("Gói đang chọn", state.plan.name);
  payload.append("Số trang", String(pages));
  payload.append("Tính năng thêm", state.addonNames.length ? state.addonNames.join(", ") : "Chưa chọn");
  payload.append("Dự toán", state.priceText);
  payload.append("Mô tả thêm", q("#briefNote").value.trim() || "Không có");
  payload.append("_honey", "");

  submitButton.disabled = true;
  if (buttonText) buttonText.textContent = "ĐANG GỬI...";
  setBriefStatus("Đang chuyển yêu cầu tới Quân Dev…");

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Form endpoint returned an error");

    setBriefStatus("✓ Đã gửi yêu cầu. Quân Dev sẽ nhận nội dung qua email.", "success");
    form.dataset.sent = "true";
  } catch (error) {
    console.error(error);
    setBriefStatus("Không gửi được lúc này. Hãy bấm “Sao chép brief” hoặc nhắn Zalo 0975 853 340.", "error");
  } finally {
    submitButton.disabled = false;
    if (buttonText) buttonText.textContent = "GỬI YÊU CẦU ↗";
  }
});

// Mobile navigation
const menuToggle = q("#menuToggle");
const mainNav = q("#mainNav");

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Mở menu");
}

menuToggle?.addEventListener("click", () => {
  const open = !document.body.classList.contains("menu-open");
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
});

mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

update();
