const $siteList = $(".siteList");
const $lastLi = $siteList.find("li.last");
const x = localStorage.getItem("x");
const xObject = JSON.parse(x); //字符串变对象

//初始化hashMap（生成结构）
const hashMap = xObject || [
  { logo: "A", url: "https://www.acfun.cn" },
  { logo: "B", url: "https://www.bilibili.com" },
];

//简化url
const simplifyUrl = (url) => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, ""); //删除 / 开头的内容
};

//创建站点
const render = () => {
  $siteList.find("li:not(.last)").remove(); //清空新增网站之前的节点
  hashMap.forEach((node, index) => {
    const $li = $(`<li>
      <div class="site">
        <div class="logo">${node.logo}</div>
        <div class="link"> ${simplifyUrl(node.url)} </div>
        <div class='close'>
          <svg class="icon">
            <use xlink:href="#icon-close"></use>
          </svg>
        </div>
      </div>
    </li>`).insertBefore($lastLi);
    //点击跳转页面
    $li.on("click", () => {
      window.open(node.url);
    });
    //删除功能
    $li.on("click", ".close", (e) => {
      e.stopPropagation(); //阻止close冒泡
      hashMap.splice(index, 1);
      render();
    });
  });
};
render();

//用户输入新增网站（及纠正用户的错误）
$(".addButton").on("click", () => {
  let url = window.prompt("请问你要添加的网站是啥？"); //显示对话框
  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url,
  });
  render();
});

//当前的hashMap存到localStorage（用户关闭页面之前触发）
window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap); //对象变字符串
  localStorage.setItem("x", string);
};

//键盘事件
$(document).on("keypress", (e) => {
  const { key } = e; //key=e.key的简写
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
