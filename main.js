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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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
      button_input.style.backgroundColor = "rgba(0,0,0,.5)";
      input_val.style.display = "none";
      button_input.textContent = "append";
      BPT = new BottomPanelTools();
      BPT.create_set_nodes(parseInt(this.get_count_node));
      let reset_value = function() {
        button_input.textContent = "push";
        button_input.style.backgroundColor = "rgba(0,0,0,0)";
        input_val.style.display = "inline";
      };
      setTimeout(reset_value, 500);
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
      new_div.setAttribute("class", "node");
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
  }

  get rect_border_field() {
    return document.getElementById("field").getBoundingClientRect();
  }

  get object_inside() {
    let elems = document.getElementsByClassName("node draggable");
    let include_elems = [];
    for (let i = 0; i < elems.length; i++) {
      let rect_elem = elems[i].getBoundingClientRect();
      if (
        this.rect_border_field.left < rect_elem.left &&
        this.rect_border_field.right > rect_elem.right &&
        this.rect_border_field.top < rect_elem.top &&
        this.rect_border_field.bottom > rect_elem.bottom
      ) {
        include_elems.push(elems[i]);
      }
    }
    return include_elems;
  }

  change_state_field() {
    this.view_count_elems_field();
    let nodes_include = this.object_inside;
    this.one_elem_click_processing(nodes_include);
  }

  one_elem_click_processing(nodes_include) {
    for (let i = 0; i < nodes_include.length; i++) {
      if (nodes_include[i].hasAttribute("data-id")) {
        nodes_include[i].setAttribute("class", "node draggable field mark save");
      } else {
        nodes_include[i].setAttribute("class", "node draggable field");
      }
    }
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


class Interaction {
  constructor() {
    this.itemMove = false;
    this.itemElement = null;
    this.offsetX;
    this.offsetY;
  }

  event_listens() {
    document.body.addEventListener("mousedown", function(e) {
      if (e.target.classList.contains("node")) {
        e.preventDefault();
        e.target.setAttribute("class", "node draggable");
        this.itemMove = true;
        this.itemElement = e.target;
        const itemRect = this.itemElement.getBoundingClientRect();
        this.itemElement.style.position = "absolute";
        this.offsetX = e.clientX - itemRect.x;
        this.offsetY = e.clientY - itemRect.y;
        new Interaction().moveItemToXY(this.itemElement, e.x, e.y, this.offsetX, this.offsetY);
        this.itemElement.ondragstart = function(e) {
          return false;
        };
      }
    });

    document.body.addEventListener("mousemove", function(e) {
      if (!this.itemMove) return false;
      if (e.buttons != 1) {
        this.itemMove = false;
        return;
      }
      new Interaction().moveItemToXY(this.itemElement, e.x, e.y, this.offsetX, this.offsetY);
      return false;
    });

    document.body.addEventListener("mouseup", function(e) {
      if (this.itemMove) this.itemMove = false;
      if (
        F.rect_border_field.left < e.x &&
        F.rect_border_field.right > e.x &&
        F.rect_border_field.top < e.y &&
        F.rect_border_field.bottom > e.y
      ) {
        F.change_state_field();
      }
    });
  }

  moveItemToXY(item, x, y, offX, offY) {
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
}

I = new Interaction();
I.event_listens();


class PopUp extends MainPage{
  constructor() {
    super();
  };

  select_display_body() {
    return document.getElementById("display_popup");
  }

  select_display_exit() {
    return document.getElementById("exit_popup");
  }

  select_popup_body() {
    return document.getElementById("popup_body");
  }

  select_popup_input() {
    return document.getElementById("popup_input");
  }

  select_popup_button() {
    return document.getElementById("popup_button");
  }

  // TODO: do view all display popup for tap special button - not static method - will call other class MainPage <- Top Setting class
  create_display_popup(node, value) {
    node.textContent = value.toString();
    let display_popup = document.createElement("DIV");
    display_popup.setAttribute("id", "display_popup");
    node.appendChild(display_popup);
    display_popup.style.top = (-parseFloat(node.offsetHeight) - parseFloat(display_popup.offsetHeight) / 2).toString()  + "px";
    display_popup.style.left = (parseFloat(node.offsetWidth) / 2 - parseFloat(display_popup.offsetWidth) / 2).toString()  + "px";

    let popup_exit = document.createElement("DIV");
    popup_exit.setAttribute("id", "exit_popup");
    node.appendChild(popup_exit);
    popup_exit.style.top = (-parseFloat(node.offsetHeight) - parseFloat(display_popup.offsetHeight) / 2).toString()  + "px";
    popup_exit.style.left = (parseFloat(display_popup.offsetWidth) - 2 * parseFloat(popup_exit.offsetWidth)).toString()  + "px";

    for(let key of Object.keys(localStorage)) {
      if (key.toString() == node.dataset.id.toString()){
        display_popup.textContent = "key: " + key;
        break;
      }
    }

    this.select_display_body().parentElement.setAttribute("class", "node draggable field mark save");
  }

  // TODO: do hidden all display popup for tap special button - not static method - will call other class MainPage <- Top Setting class
  remove_popup(display) {
    if (display) {
      if (this.select_display_body()) {
        this.select_display_body().parentElement.setAttribute("class", "node draggable field mark save");
        this.select_display_body().remove();
        this.select_display_exit().remove();
      }
    } else {
      if (this.select_popup_body()) {
        this.select_popup_body().parentElement.setAttribute("class", "node draggable field");
        this.select_popup_body().remove();
      }
    }
  }

  delete_data(node) {
    node.textContent = "";
    localStorage.removeItem(node.getAttribute("data-id"));
    node.removeAttribute("data-id");
  }

  save_data(node, value) {
    this.random_num = [];
    var random_value = this.getRandomInt(0, 100);
    while (this.random_num.includes(random_value)) {
      random_value = this.getRandomInt(0, 100);
    }
    this.random_num[this.random_num.length] = random_value;
    node.setAttribute("data-id", this.random_num[this.random_num.length - 1].toString());
    localStorage.setItem(this.random_num[this.random_num.length - 1].toString(), value.toString());
  }

  create_popup(e) {
    let build_start = e.target;
    let popup_body = document.createElement("DIV");
    popup_body.setAttribute("id", "popup_body");
    build_start.appendChild(popup_body);
    popup_body.style.top = (-parseFloat(popup_body.offsetHeight) - 10.0).toString() + "px";
    popup_body.style.left = (parseFloat(build_start.offsetWidth) / 2 - parseFloat(popup_body.offsetWidth) / 2 - 5).toString() + "px";

    let popup_input = document.createElement("INPUT");
    popup_input.setAttribute("id", "popup_input");
    popup_body.appendChild(popup_input);
    popup_input.focus();

    let popup_button = document.createElement("BUTTON");
    popup_button.setAttribute("id", "popup_button");
    popup_body.appendChild(popup_button);
    popup_button.innerHTML = "save";

    this.select_popup_body().parentElement.setAttribute("class", "node draggable field mark");
  }

  double_click_proc(e) {
    e.preventDefault();
    if (this.select_popup_body() || !e.target.classList.contains("save")) {
      if (e.target.classList.contains("field") && !(e.target.classList.contains("mark")) && (this.select_popup_body() == null)) {
        this.create_popup(e);
      } else if ((e.target.id == "field" || e.target.classList.contains("field") || e.target.id == "popup_body") && this.select_popup_body()) {
        this.remove_popup(false);
      }
    }
  }

  one_click_proc(e) {
    e.preventDefault();
    if ((e.target.id == "popup_button") && this.select_popup_input().value) {
      let value = this.select_popup_input().value;
      let node = this.select_popup_body().parentElement;
      this.save_data(node, value);
      this.create_display_popup(node, value);
    } else if ((e.target.id == "popup_body" || e.target.id == "popup_button") && !(this.select_popup_input().value)) {
      this.select_popup_body().style.backgroundColor = "rgba(255, 150, 150, 0.5)";
    } else if (e.target.id == "popup_input") {
      this.select_popup_body().style.backgroundColor = "rgba(150, 150, 255, 0.5)";
    } else if ((e.target.id == "display_popup") || ((this.select_display_body() != null) && (e.target == this.select_display_body().parentElement))) {
      let node = this.select_display_body().parentElement;
      this.remove_popup(true);
      node.setAttribute("class", "node draggable field mark save");
    } else if ((e.target.textContent != "") && (e.target.classList.contains("save")) && (this.select_display_body() == null) && (this.select_popup_body() == null)) {
      this.create_display_popup(e.target, e.target.textContent);
    } else if ((e.target.id == "exit_popup") && (e.target.parentElement.classList.contains("save"))) {
      let node = this.select_display_body().parentElement;
      this.remove_popup(true);
      this.delete_data(node);
      node.setAttribute("class", "node draggable field");
    }
  }

  processing_popup() {
    document.body.addEventListener("dblclick", function(e) {
      PU.double_click_proc(e);
    });
    document.body.addEventListener("click", function(e) {
      PU.one_click_proc(e);
    });
  }
}

var PU = new PopUp();
PU.processing_popup();