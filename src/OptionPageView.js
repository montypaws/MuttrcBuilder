let _ = require("underscore");
let $ = require("jquery");
let Backbone = require("backbone");
Backbone.$ = $;

import PageDropdownInnerView from "./PageDropdownInnerView";

class OptionPageView extends Backbone.View.extend({
    template: _.template(`
<hr />
<form>
<div id="change-page-holder"></div>
    <% for (let option of options) { %>
        <hr />
        <h3><%= option.get("id") %></h3>
        <p>
            <strong>Type:</strong> <%= option.get("type") %>
            <strong>Default:</strong> <%= option.get("default") %>
        <p>
        <div class="htmldesc"><%= option.get("text") %></div>
        <% if (option.possibleValues()) { %>
        <select class="option" name="<%= option.get("id") %>">
        <% for(let v of option.possibleValues()) { %>
            <option value="<%= v %>"<% if (v == option.currentValue()) { %> selected="selected"<% } %>><%= v %></option>
        <% } %>
        </select>
        <% } else { %>
        <input class="option" name="<%= option.get("id") %>" value="<%= option.currentValue() %>" />
        <% } %>
    <% } %>
        `),

    events: {
        "change #page": "displayOptionPage",
        "change .option": "updateAttr"
    }
}) {
    updateAttr(e) {
        let formElement = $(e.target);
        this.model.get("attrs").get(formElement.attr("name")).set("value", formElement.val());
    }

    displayOptionPage() {
        let pg = $("#page").val();
        if (pg == "_finish") {
            Backbone.history.navigate(`build/${this.model.get("id")}`, {trigger: true});
        } else if (pg == "_colour") {
            Backbone.history.navigate(`colours/${this.model.get("id")}`, {trigger: true});
        } else {
            Backbone.history.navigate(`options/${this.model.get("id")}/${pg}`, {trigger: true});
        }
        this.close();
    }

    render(page) {
        this.$el.html(this.template({version: this.model, page: page, options: this.model.get("attrs").where({"category": page})}));
        let pageChanger = new PageDropdownInnerView({model: this.model, el: this.$el.find("#change-page-holder")});
        pageChanger.render(page);
        return this.$el;
    }

    close() {
        this.remove();
        this.unbind();
    }
}

export default OptionPageView;
