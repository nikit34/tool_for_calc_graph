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
    return new Field().object_inside.length;
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
      new BottomPanelTools().create_set_nodes(parseInt(this.get_count_node));
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
var TS = new TopSetting(10);

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
        nodes_include[i].setAttribute(
          "class",
          "node draggable field mark save"
        );
      } else if (nodes_include[i].children.length != 0) {
        nodes_include[i].setAttribute("class", "node draggable field mark");
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

var F = new Field();

class SetNodes {
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
        new SetNodes().moveItemToXY(
          this.itemElement,
          e.x,
          e.y,
          this.offsetX,
          this.offsetY
        );
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
      new SetNodes().moveItemToXY(
        this.itemElement,
        e.x,
        e.y,
        this.offsetX,
        this.offsetY
      );
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
    let minX = 0,
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

SN = new SetNodes();
SN.event_listens();


class Data {
  constructor() {}

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  delete_data(node) {
    node.textContent = "";
    localStorage.removeItem(node.getAttribute("data-id"));
    node.removeAttribute("data-id");
  }

  clear_localStorage() {
    localStorage.clear();
  }

  save_data(node, value) {
    this.random_num = [];
    var random_value = this.getRandomInt(0, 100);
    while (this.random_num.includes(random_value)) {
      random_value = this.getRandomInt(0, 100);
    }
    this.random_num[this.random_num.length] = random_value;
    node.setAttribute(
      "data-id",
      this.random_num[this.random_num.length - 1].toString()
    );
    localStorage.setItem(
      this.random_num[this.random_num.length - 1].toString(),
      [value.toString(), (Math.round(parseFloat(node.offsetLeft) + parseFloat(node.offsetWidth) / 2 - parseFloat(F.rect_border_field.left))).toString()]
    );
  }
}

var D = new Data();


class PopUp extends Data {
  constructor() {
    super();
  }

  select_display_body() {
    return document.getElementsByClassName("display_popup");
  }

  select_display_exit() {
    return document.getElementsByClassName("exit_popup");
  }

  select_popup_body() {
    return document.getElementsByClassName("popup_body");
  }

  select_popup_input() {
    return document.getElementsByClassName("popup_input");
  }

  select_popup_button() {
    return document.getElementsByClassName("popup_button");
  }

  // TODO: do view all display popup for tap special button - not static method - will call other class MainPage <- Top Setting class
  create_display_popup(node, value) {
    let display_popup = document.createElement("DIV");

    if (value != null) {
      node.textContent = value.toString();
    }
    for (let key of Object.keys(localStorage)) {
      if (key.toString() == node.dataset.id.toString()) {
        display_popup.textContent = "key: " + key;
        break;
      }
    }

    display_popup.setAttribute("class", "display_popup");
    node.appendChild(display_popup);
    display_popup.style.top =
      (
        -parseFloat(node.offsetHeight) -
        parseFloat(display_popup.offsetHeight) / 2
      ).toString() + "px";
    display_popup.style.left =
      (
        parseFloat(node.offsetWidth) / 2 -
        parseFloat(display_popup.offsetWidth) / 2
      ).toString() + "px";

    let popup_exit = document.createElement("DIV");
    popup_exit.setAttribute("class", "exit_popup");
    node.appendChild(popup_exit);
    popup_exit.style.top =
      (
        -parseFloat(node.offsetHeight) -
        parseFloat(display_popup.offsetHeight) / 2
      ).toString() + "px";
    popup_exit.style.left =
      (
        parseFloat(display_popup.offsetWidth) -
        2 * parseFloat(popup_exit.offsetWidth)
      ).toString() + "px";

    for (let i = 0; i < this.select_display_body().length; i++) {
      this.select_display_body()[i].parentElement.setAttribute(
        "class",
        "node draggable field mark save"
      );
    }
  }

  // TODO: do hidden all display popup for tap special button - not static method - will call other class MainPage <- Top Setting class
  remove_popup(display, elem) {
    if (elem.className == "display_popup" || elem.className == "exit_popup") {
      elem = elem.parentElement;
    }
    if (display) {
      for (let i = 0; i < this.select_display_body().length; i++){
        if (this.select_display_body()[i]) {
          if (this.select_display_body()[i].parentElement.getAttribute("data-id") == null || (this.select_display_body()[i].parentElement.getAttribute("data-id").toString() == elem.getAttribute("data-id").toString())) {
            this.select_display_body()[i].parentElement.setAttribute(
              "class",
              "node draggable field mark save"
            );
            this.select_display_body()[i].remove();
            this.select_display_exit()[i].remove();
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < this.select_popup_body().length; i++){
        if (this.select_popup_body()[i]) {
          if (this.select_popup_body()[i].parentElement.getAttribute("data-id") == null || (this.select_popup_body()[i].parentElement.getAttribute("data-id").toString() == elem.getAttribute("data-id").toString())) {
            this.select_popup_body()[i].parentElement.setAttribute(
              "class",
              "node draggable field"
            );
            this.select_popup_body()[i].remove();
            break;
          }
        }
      }
    }
  }

  create_popup(e) {
    let build_start = e.target;
    let popup_body = document.createElement("DIV");
    popup_body.setAttribute("class", "popup_body");
    build_start.appendChild(popup_body);
    popup_body.style.top =
      (-parseFloat(popup_body.offsetHeight) - 10.0).toString() + "px";
    popup_body.style.left =
      (
        parseFloat(build_start.offsetWidth) / 2 -
        parseFloat(popup_body.offsetWidth) / 2 -
        5
      ).toString() + "px";

    let popup_input = document.createElement("INPUT");
    popup_input.setAttribute("class", "popup_input");
    popup_body.appendChild(popup_input);
    popup_input.focus();

    let popup_button = document.createElement("BUTTON");
    popup_button.setAttribute("class", "popup_button");
    popup_body.appendChild(popup_button);
    popup_button.innerHTML = "save";

    for (let i = 0; i < this.select_popup_body().length; i++) {
      this.select_popup_body()[i].parentElement.setAttribute(
        "class",
        "node draggable field mark"
      );
    }
  }

  double_click_proc(e) {
    e.preventDefault();
    let loop_popup = this.select_popup_body().length;
    if (loop_popup == 0) {
      loop_popup = 1;
    }
    for (let i = 0; i < loop_popup; i++) {
      if (this.select_popup_body()[i] || !e.target.classList.contains("save")) {
        if (
          e.target.classList.contains("field") &&
          !e.target.classList.contains("mark") &&
          this.select_popup_body()[i] == null
        ) {
          this.create_popup(e);
        } else if (
          (e.target.id == "field" ||
            e.target.classList.contains("field") ||
            e.target.className == "popup_body") &&
          this.select_popup_body()[i]
        ) {
          this.remove_popup(false, e.target);
        }
      }
    }
  }

  one_click_proc(e) {
    e.preventDefault();
    let loop_popup = this.select_popup_body().length;
    if (loop_popup == 0) {
      loop_popup = 1;
    }
    let loop_display = this.select_display_body().length;
    if (loop_display == 0) {
      loop_display = 1;
    }
    for (let i = 0; i < loop_popup; i++) {
      for (let j = 0; j < loop_display; j++) {
        if (
          e.target.className == "popup_button" &&
          this.select_popup_input()[i].value &&
          Number.isInteger(parseInt(this.select_popup_input()[i].value))
        ) {
          let value = this.select_popup_input()[i].value;
          let node = this.select_popup_body()[i].parentElement;
          this.save_data(node, value);
          this.create_display_popup(node, value);
          break;
        } else if (
          e.target.className == "popup_button" &&
          this.select_popup_input()[i].value &&
          !Number.isInteger(parseInt(this.select_popup_input()[i].value))
        ) {
          this.select_popup_body()[i].style.backgroundColor =
            "rgba(255, 150, 150, 0.5)";
          let random_int = D.getRandomInt(0, 100);
          this.select_popup_input()[i].value = random_int;
          break;
        } else if (
          (e.target.className == "popup_body" || e.target.className == "popup_button") &&
          !this.select_popup_input()[i].value
        ) {
          this.select_popup_body()[i].style.backgroundColor =
            "rgba(255, 150, 150, 0.5)";
          break;
        } else if (e.target.className == "popup_input") {
          this.select_popup_body()[i].style.backgroundColor =
            "rgba(150, 150, 255, 0.5)";
          break;
        } else if (
          e.target.className == "display_popup" ||
          (this.select_display_body()[j] != null &&
            e.target == this.select_display_body()[j].parentElement)
        ) {
          let node = this.select_display_body()[j].parentElement;
          this.remove_popup(true, e.target);
          node.setAttribute("class", "node draggable field mark save");
          break;
        } else if (
          e.target.textContent != "" &&
          e.target.classList.contains("save") &&
          this.select_popup_body()[i] == null &&
          e.target.children.length == 0
        ) {
          this.create_display_popup(e.target, null);
          break;
        } else if (
          e.target.className == "exit_popup" &&
          e.target.parentElement.classList.contains("save")
        ) {
          let node = e.target.parentElement;
          this.remove_popup(true, e.target);
          this.delete_data(node);
          node.setAttribute("class", "node draggable field");
          break;
        }
      }
      break;
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


class DrawLine {
  constructor() {
    this.canvas_elem = document.getElementById("field");
    this.context = this.canvas_elem.getContext("2d");
    this.line_coordinate = { x: 0, y: 0 };
    this.isDrawStart = false;
  }




  getClientOffset(e) {
    let { pageX, pageY } = e.touches ? e.touches[0] : e;
    let x = pageX - this.canvas_elem.offsetLeft;
    let y = pageY - this.canvas_elem.offsetTop;
    return {x, y};
  }

  drawLine() {
    this.context.beginPath();
    this.context.moveTo(this.start_position.x, this.start_position.y);
    this.context.lineTo(this.line_coordinate.x, this.line_coordinate.y);
    this.context.stroke();
  }

  mouseDownListener(e) {
    this.start_position = this.getClientOffset(e);
    this.isDrawStart = true;
    return this.start_position;
  }

  mouseMoveListener(e) {
    if (!this.isDrawStart) return;

    this.line_coordinate = this.getClientOffset(e);
    this.clearCanvas();
    this.drawLine();
    return this.start_position;
  }

  mouseupListener(e) {
    this.isDrawStart = false;
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas_elem.width, this.canvas_elem.height);
  }

  draw_line() {
    this.canvas_elem.addEventListener("mousedown", function(e) {
      DL.mouseDownListener(e);
      CLN.get_coord_line(e);
    });
    this.canvas_elem.addEventListener("mousemove", function(e) {
      DL.mouseMoveListener(e);
    });
    this.canvas_elem.addEventListener("mouseup", function(e) {
      DL.mouseupListener(e)
      CLN.get_coord_line(e);
    });
    this.canvas_elem.addEventListener("touchstart", function(e) {
      DL.mouseDownListener(e);
    });
    this.canvas_elem.addEventListener("touchmove",function(e) {
      DL.mouseMoveListener(e);
    });
    this.canvas_elem.addEventListener("touchend", function(e) {
      DL.mouseupListener(e)
    });
  }
}

var DL = new DrawLine();
DL.draw_line();


class ConcatLineNodes extends DrawLine {
  constructor() {
    super();
    this.pair_nodes = [];
    this.count_get_coord = 0;
    this.nodes = Object.values(localStorage);
  }

  add_binding_localStorage(pair_nodes){
    let existing = localStorage.getItem(pair_nodes[0]);
    existing = existing ? existing.split(",") : [];
    existing.push(pair_nodes[1]);
    localStorage.setItem(pair_nodes[0], existing.toString());

    existing = localStorage.getItem(pair_nodes[1]);
    existing = existing ? existing.split(",") : [];
    existing.push(pair_nodes[0]);
    localStorage.setItem(pair_nodes[1], existing.toString());
  }

  binding(nearest_node){
    this.pair_nodes.push(nearest_node);
    if (this.count_get_coord == 2) {
      // this.add_binding_localStorage(pair_nodes);
      // call_weight();
      CLN = new ConcatLineNodes();
    }
  }

  affiliation(point_line) {
    let x_node = 0,
        y_node = 0;
    let min_dist = Number.MAX_VALUE;
    let x_line = parseFloat(point_line.x),
        y_line = parseFloat(point_line.y);
    let index_min_dist = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      x_node = parseInt(this.nodes[i].split(",")[1]);
      y_node = parseInt(this.nodes[i].split(",")[2]);
      if (Math.sqrt(Math.pow(x_line - x_node, 2) + Math.pow(y_line - y_node, 2)) < min_dist) {
        min_dist = Math.sqrt(Math.pow(x_line - x_node, 2) + Math.pow(y_line - y_node, 2));
        index_min_dist = i;
      }
    }
    return localStorage.key(index_min_dist);
  }

  get_coord_line(e) {
    this.count_get_coord++;
    let point_line = this.getClientOffset(e);
    let nearest_node = this.affiliation(point_line);
    console.log(this.count_get_coord, nearest_node);
    this.binding(nearest_node);
  }
}

var CLN = new ConcatLineNodes();
