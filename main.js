"use strict;";

class MainPage {
  constructor() {}

  get get_count_node() {
    return this.count_node;
  }

  set_nodes(count_node) {
    BPT = new BottomPanelTools();
    BPT.create_set_nodes(count_node);
  }
}

class TopSetting extends MainPage {
  constructor(count_node) {
    super();
    this.count_node = count_node;
  }

  showInputGenerateObjects() {
    var button_input = document.getElementById("buttonGenerateObjects");
    var input_val = document.getElementById("inputGenerateObjects");
    if (button_input.textContent == "push" || button_input.textContent == "append") {
      button_input.style.backgroundColor = "rgba(0,0,0,.7)";
      input_val.style.display = "none";
      this.count_node = input_val.value;
      button_input.textContent = "append";
      this.set_nodes(this.count_node);
      let reset_value = function() {
        button_input.textContent = "push";
        button_input.style.backgroundColor = "rgba(0,0,0,0)";
        input_val.style.display = "inline";
      };
      setTimeout(reset_value, 2000);
    } else {
      button_input.textContent = "push";
      button_input.style.width = "10%";
      input_val.setAttribute("value", this.count_node);
      input_val.setAttribute("type", "number");
    }
  }
}
TS = new TopSetting(7);

class BottomPanelTools extends MainPage {
  constructor() {
    super();
    this.MP = new MainPage();
  }
  create_set_nodes(count_node) {
    let was_count_nodes = document.getElementsByClassName("node").length;
    let need_count_nodes = was_count_nodes + parseInt(count_node);
    var start_tag = document.getElementById("inputGenerateObjects");
    var new_div, old_p, new_p, new_br;

    if (document.getElementById("auto_p") == null || typeof(document.getElementById("auto_p")) == 'undefined') {
      old_p = document.createElement("P");
      old_p.setAttribute("id", "auto_p");
      start_tag.after(old_p);
    } else {
      old_p = document.getElementById("auto_p");
    }
    for (let i = was_count_nodes; i < need_count_nodes; i++){
      new_div = document.createElement("DIV");
      new_div.setAttribute("class", "node");
      if (i != 0 && i % 10 == 0){
        new_br = document.createElement("BR");
        old_p.after(new_br);
        new_p = document.createElement("P");
        new_p.setAttribute("id", "auto_p");
        new_br.after(new_p);
        new_p.after(new_div);
      }
      old_p.after(new_div);
    }
  }
}
BPT = new BottomPanelTools();

// let itemMove = false,
//   itemElement = null,
//   offsetX,
//   offsetY; // offset from up left side of the hero's image.

// document.body.addEventListener("mousedown", function(e) {
//   if (e.target.classList.contains("draggable")) {
//     e.preventDefault();
//     itemMove = true;
//     itemElement = e.target;
//     console.dir(e.target);
//     const itemRect = itemElement.getBoundingClientRect();
//     itemElement.style.position = "absolute";
//     offsetX = e.clientX - itemRect.x;
//     offsetY = e.clientY - itemRect.y;
//     //console.log(offsetX, offsetY);
//     moveItemToXY(itemElement, e.x, e.y, offsetX, offsetY);
//     itemElement.ondragstart = function(e) {
//       return false;
//     };
//   }
// });

// document.addEventListener("mousemove", function(e) {
//   if (!itemMove) return false;
//   if (e.buttons != 1) {
//     itemMove = false;
//     return;
//   }
//   moveItemToXY(itemElement, e.x, e.y, offsetX, offsetY);
//   return false;
// });

// document.addEventListener("mouseup", function(e) {
//   if (itemMove) itemMove = false;
// });

// function moveItemToXY(item, x, y, offX, offY) {
//   //lets try to make this function in function's style
//   let itemRect = item.getBoundingClientRect();
//   // find minX, minY, maxX, maxY;
//   //document.documentElement.clientHeight can change when we moveup heroes.
//   //therefore we need to check height every time we moving item
//   const minX = 0,
//     minY = 0,
//     maxY = document.documentElement.clientHeight - item.offsetHeight,
//     maxX = document.documentElement.clientWidth - item.offsetWidth;
//   let itemX = x - offX,
//     itemY = y - offY;
//   if (itemX < minX) itemX = minX;
//   if (itemY < minY) {
//     window.scrollBy(0, itemY - minY);
//     itemY = minY;
//   }
//   if (itemX > maxX) itemX = maxX;
//   if (itemY > maxY) {
//     window.scrollBy(0, itemY - maxY);
//     itemY = maxY;
//   }
//   item.style.left = itemX + pageXOffset + "px";
//   item.style.top = itemY + pageYOffset + "px";
//   //console.dir(maxX + '  ' + maxY);
// }
