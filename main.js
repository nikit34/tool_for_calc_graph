"use strict;";

class MainPage {
  constructor() {}

  get get_was_count_node() {
    return document.getElementsByClassName("node").length;
  }

  get get_count_node() {
    return document.getElementById("inputGenerateObjects").value;
  }

  get get_now_count_node() {
    F = new Field();
    return F.object_inside.length;
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
    if (
      button_input.textContent == "push" ||
      button_input.textContent == "append"
    ) {
      button_input.style.backgroundColor = "rgba(0,0,0,.7)";
      input_val.style.display = "none";
      button_input.textContent = "append";
      BPT = new BottomPanelTools();
      BPT.create_set_nodes(parseInt(this.get_count_node));
      let reset_value = function() {
        button_input.textContent = "push";
        button_input.style.backgroundColor = "rgba(0,0,0,0)";
        input_val.style.display = "inline";
      };
      setTimeout(reset_value, 1000);
    } else {
      button_input.textContent = "push";
      button_input.style.width = "150px";
      input_val.setAttribute("value", this.count_node);
      input_val.setAttribute("type", "number");
    }
  }
}
TS = new TopSetting(10);

class BottomPanelTools extends MainPage {
  constructor() {
    super();
  }

  create_set_nodes(count_node) {
    let was_count_nodes = this.get_was_count_node;
    let need_count_nodes = was_count_nodes + parseInt(count_node);
    var start_tag = document.getElementById("init_date");
    var new_div, old_p, new_p, new_br;

    if (
      document.getElementById("auto_p") == null ||
      typeof document.getElementById("auto_p") == "undefined"
    ) {
      old_p = document.createElement("P");
      old_p.setAttribute("id", "auto_p");
      start_tag.after(old_p);
    } else {
      old_p = document.getElementById("auto_p");
    }
    for (let i = was_count_nodes; i < need_count_nodes; i++) {
      new_div = document.createElement("DIV");
      new_div.setAttribute("class", "node draggable");
      if (i != 0 && i % 10 == 0) {
        new_br = document.createElement("BR");
        old_p.after(new_br);
        new_p = document.createElement("P");
        new_p.setAttribute("id", "auto_p");
        new_br.after(new_p);
        new_p.after(new_div);
      }
      old_p.after(new_div);
    }
    document.getElementById(
      "show_total_count_nodes"
    ).innerHTML = need_count_nodes;
    document.getElementById("show_now_count_nodes").innerHTML =
      this.get_was_count_node - this.get_now_count_node;
  }
}
BPT = new BottomPanelTools();

class Field extends MainPage {
  constructor() {
    super();
    this.rect = document.getElementById("field").getBoundingClientRect();
  }

  get object_inside() {
    let elems = document.getElementsByClassName("node draggable");
    let include_elems = [];
    for (let i = 0; i < elems.length; i++) {
      let rect_elem = elems[i].getBoundingClientRect();
      if (
        this.rect.left < rect_elem.left &&
        this.rect.right > rect_elem.right &&
        this.rect.top < rect_elem.top &&
        this.rect.bottom > rect_elem.bottom
      ) {
        include_elems.push(elems[i]);
      }
    }
    return include_elems;
  }

  change_state_field(){
    this.view_count_elems_field();
    let nodes_incide = this.object_inside;
    let one_node = this.one_elem_click_processing(nodes_incide);
    set_width_node(one_node);
  }

  one_elem_click_processing(nodes_incide) {
    for (let i = 0; i < nodes_incide.length; i++) {
      nodes_incide[i].addEventListener('dblclick', function (e) {
        nodes_incide[i].classList.add('mark');
        return nodes_incide[i];
      });
    }
  }

  set_width_node(one_node) {
    console.log(one_node);
  }

  view_count_elems_field() {
    document.getElementById(
      "show_count_nodes_field"
    ).innerHTML = this.object_inside.length;
    document.getElementById("show_now_count_nodes").innerHTML =
      this.get_was_count_node - this.get_now_count_node;
  }
}

F = new Field();

let itemMove = false,
  itemElement = null,
  offsetX,
  offsetY;

document.body.addEventListener("mousedown", function(e) {
  if (e.target.classList.contains("draggable")) {
    e.preventDefault();
    itemMove = true;
    itemElement = e.target;
    const itemRect = itemElement.getBoundingClientRect();
    itemElement.style.position = "absolute";
    offsetX = e.clientX - itemRect.x;
    offsetY = e.clientY - itemRect.y;
    moveItemToXY(itemElement, e.x, e.y, offsetX, offsetY);
    itemElement.ondragstart = function(e) {
      return false;
    };
  }
});

document.body.addEventListener("mousemove", function(e) {
  if (!itemMove) return false;
  if (e.buttons != 1) {
    itemMove = false;
    return;
  }
  moveItemToXY(itemElement, e.x, e.y, offsetX, offsetY);
  return false;
});

document.body.addEventListener("mouseup", function(e) {
  if (itemMove) itemMove = false;
  new Field().change_state_field();
});

function moveItemToXY(item, x, y, offX, offY) {
  let itemRect = item.getBoundingClientRect();
  const minX = 0,
    minY = 0,
    maxY = document.documentElement.clientHeight - item.offsetHeight,
    maxX = document.documentElement.clientWidth - item.offsetWidth;
  let itemX = x - offX,
    itemY = y - offY;
  if (itemX < minX) itemX = minX;
  if (itemY < minY) {
    window.scrollBy(0, itemY - minY);
    itemY = minY;
  }
  if (itemX > maxX) itemX = maxX;
  if (itemY > maxY) {
    window.scrollBy(0, itemY - maxY);
    itemY = maxY;
  }
  item.style.left = itemX + pageXOffset + "px";
  item.style.top = itemY + pageYOffset + "px";
}
