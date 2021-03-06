import Ember from 'ember';
import StyleBindingsMixin from 'ember-table-legacy/mixins/style-bindings';

export default Ember.View.extend(
StyleBindingsMixin, {
  // ---------------------------------------------------------------------------
  // API - Inputs
  // ---------------------------------------------------------------------------

  // TODO: Doc
  templateName: 'table-cell',
  classNames: ['ember-table-cell'],
  classNameBindings: 'column.textAlign',
  styleBindings: 'width',

  // ---------------------------------------------------------------------------
  // Internal properties
  // ---------------------------------------------------------------------------

  init: function() {
    this._super();
    this.contentPathDidChange();
    this.contentDidChange();
  },

  row: Ember.computed.alias('parentView.row'),
  column: Ember.computed.alias('content'),
  width: Ember.computed.alias('column.width'),

  contentDidChange: function() {
    this.notifyPropertyChange('cellContent');
  },

  contentPathWillChange: Ember.beforeObserver(function() {
    var contentPath = this.get('column.contentPath');
    if (contentPath) {
      this.removeObserver("row." + contentPath, this,
          this.contentDidChange);
    }
  }, 'column.contentPath'),

  contentPathDidChange: Ember.beforeObserver(function() {
    var contentPath = this.get('column.contentPath');
    if (contentPath) {
      this.addObserver("row." + contentPath, this,
          this.contentDidChange);
    }
  }, 'column.contentPath'),

  cellContent: Ember.computed(function(key, value) {
    var row = this.get('row');
    var column = this.get('column');
    if (!row || !column) {
      return;
    }
    if (arguments.length === 1) {
      value = column.getCellContent(row);
    } else {
      column.setCellContent(row, value);
    }
    return value;
  }).property('row.isLoaded', 'column')
});
