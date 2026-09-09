const plans={
  landing:{name:"Landing Page",base:1290000,pages:1,time:"3–5 ngày"},
  business:{name:"Website Doanh nghiệp",base:2490000,pages:5,time:"5–10 ngày"},
  catalog:{name:"Catalog Bán hàng",base:3490000,pages:5,time:"7–14 ngày"},
  custom:{name:"Custom / Interactive",base:null,pages:1,time:"Đánh giá theo dự án"}
};

let current="landing";
let pages=1;

const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];
const fmt=n=>new Intl.NumberFormat("vi-VN").format(n)+"đ";

function setPlan(key){
  current=key;
  pages=plans[key].pages;
  qa(".plan").forEach(el=>el.classList.toggle("active",el.dataset.plan===key));
  update();
  q("#quote").scrollIntoView({behavior:"smooth",block:"start"});
}

function update(){
  const p=plans[current];
  q("#pages").textContent=pages;
  q("#summaryPages").textContent=pages;
  q("#summaryPlan").textContent=p.name;
  q("#estimateBadge").textContent=p.name.toUpperCase();
  q("#estimateRange").textContent="Thời gian dự kiến: "+p.time;

  const checked=qa(".addons input:checked");
  const names=checked.map(el=>el.dataset.name);
  const extra=checked.reduce((sum,el)=>sum+Number(el.dataset.price),0);
  q("#summaryAddons").textContent=names.length?names.join(", "):"Chưa chọn";

  if(p.base===null){
    q("#estimatePrice").textContent="CẦN TƯ VẤN";
    return;
  }

  const extraPages=Math.max(0,pages-p.pages)*300000;
  q("#estimatePrice").textContent=fmt(p.base+extraPages+extra);
}

qa(".plan").forEach(el=>el.addEventListener("click",()=>setPlan(el.dataset.plan)));
qa("[data-plan]:not(.plan)").forEach(el=>el.addEventListener("click",()=>setPlan(el.dataset.plan)));

q("#minus").addEventListener("click",()=>{
  pages=Math.max(1,pages-1);
  update();
});

q("#plus").addEventListener("click",()=>{
  pages=Math.min(30,pages+1);
  update();
});

qa(".addons input").forEach(el=>el.addEventListener("change",update));

q("#copyRequest").addEventListener("click",async()=>{
  const p=plans[current];
  const addons=qa(".addons input:checked").map(el=>el.dataset.name);
  const price=q("#estimatePrice").textContent;
  const text=`Xin chào Quân Dev, tôi muốn được tư vấn ${p.name}. Số trang dự kiến: ${pages}. Tính năng thêm: ${addons.length?addons.join(", "):"chưa chọn"}. Dự toán trên website: ${price}. Tôi muốn trao đổi thêm về mục tiêu và phạm vi dự án.`;

  try{
    await navigator.clipboard.writeText(text);
    q("#copyNote").textContent="✓ Đã sao chép yêu cầu tư vấn";
    setTimeout(()=>q("#copyNote").textContent="",2500);
  }catch(err){
    window.prompt("Sao chép nội dung này:",text);
  }
});

update();


function buildBrief(){
  const name=document.querySelector("#clientName").value.trim() || "Chưa cung cấp";
  const business=document.querySelector("#businessType").value.trim() || "Chưa cung cấp";
  const goal=document.querySelector("#goal").value;
  const budget=document.querySelector("#budget").value;
  const deadline=document.querySelector("#deadline").value.trim() || "Chưa xác định";
  const note=document.querySelector("#briefNote").value.trim() || "Không có";
  return `YÊU CẦU TƯ VẤN WEBSITE - QUÂN DEV

Tên / doanh nghiệp: ${name}
Lĩnh vực: ${business}
Mục tiêu: ${goal}
Ngân sách dự kiến: ${budget}
Deadline mong muốn: ${deadline}

Mô tả thêm:
${note}`;
}

const copyBriefBtn=document.querySelector("#copyBrief");
if(copyBriefBtn){
  copyBriefBtn.addEventListener("click",async()=>{
    const text=buildBrief();
    try{
      await navigator.clipboard.writeText(text);
      document.querySelector("#briefStatus").textContent="✓ Đã sao chép brief. Bạn có thể gửi qua Zalo hoặc Messenger.";
    }catch(err){
      window.prompt("Sao chép brief này:",text);
    }
  });
}

const emailBrief=document.querySelector("#emailBrief");
if(emailBrief){
  emailBrief.addEventListener("click",e=>{
    e.preventDefault();
    const subject=encodeURIComponent("Yêu cầu tư vấn website - Quân Dev");
    const body=encodeURIComponent(buildBrief());
    window.location.href=`mailto:minhquanhangtran@gmail.com?subject=${subject}&body=${body}`;
  });
}
