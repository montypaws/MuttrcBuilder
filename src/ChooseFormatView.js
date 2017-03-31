let _ = require("underscore");
let $ = require("jquery");
let Backbone = require("backbone");
let FileSaver = require("file-saver");
Backbone.$ = $;

class ChooseFormatView extends Backbone.View.extend({
    template: _.template(`
<form>
  <p>How would you like your <tt>muttrc</tt> formatted?</p>
  <p>
    <label>
      <input type="radio" name="format" value="minimal" />
      Only print out the values that are different from the default.
    </label>
    <br />
    <label>
      <input type="radio" name="format" value="all" checked="checked" />
      Print out all values, with values that are their default
      commented out.
    </label>
    <br />
    <label>
      <input type="radio" name="format" value="categories" />
      As above, but organised by category.
    </label>
    <br />
    <label>
      <input type="radio" name="format" value="full" />
      Print out the variable reference section of the mutt manual, with
      the variables filled in.
    </label>
  </p>
  <p>
    <button type="button" id="chooseFormat">Build my muttrc</button>
  </p>
</form>
        `),

    events: {
        "click #chooseFormat": "formatSelected"
    }
}) {
    render() {
        this.$el.html(this.template({versions: this.model}));
        return this.$el;
    }

    formatSelected() {
        let handler = {
            minimal: this.saveBasicFormat,
            all: this.saveFullFormat
        }[$("input[name='format']:checked").val()];
        handler();
    }

    close() {
        this.remove();
        this.unbind();
    }

    getFileHeader() {
        return [
            "# Generated by the muttrc builder (http://muttrcbuilder.org/)\n",
            "# for mutt-" + this.model.get("id") + "\n",
            "\n"
        ];
    }

    saveBasicFormat() {
        let lines = this.getFileHeader();
        for (let attr of this.model.get("attrs").models) {
            let line = writeAttr(attr, false);
            if (line) {
                lines.push(line);
            }
        }
        this.writeFile(lines);
    }

    saveFullFormat() {
        let lines = this.getFileHeader();
        for (let attr of this.model.get("attrs").models) {
            lines.push(writeAttr(attr, true));
        }
        this.writeFile(lines);
    }

    writeFile(lines) {
        let blob = new Blob(lines, {type: "text/plain;charset=iso-8859-1"});
        FileSaver.saveAs(blob, "muttrc");
    }

    writeAttr(attr, always) {
        let quote = _.contains(["boolean", "quadoption"], attr.get(type)) ? "" : "'";
        let line = "set " + attr.get("id") + " = " + quote + attr.currentValue() + quote + "\n";
        if (attr.get("default") == attr.currentValue()) {
            if (always) {
               line = "# " + line;
            } else {
               return null;
            }
        }
        return line;
    }
}

export default ChooseFormatView;
