import DS from 'ember-data';

export default DS.Model.extend({
  url: DS.attr('string'),
  description: DS.attr('string'),
  htmlUrl: DS.attr('string'),
  files: DS.hasMany('gistFile'),
  history: DS.hasMany('gistRevision'),
  public: DS.attr('boolean', {defaultValue: true}),
  currentRevision: Em.computed.oneWay('history.firstObject.shortId'),
  shortId: Em.computed('id', function() {
    return (this.get('id')||'').substring(0,7);
  }),

  /**
    Called by GistFile.registerDeleteOnGist to make sure we
    register deleted files on the server.
   */
  registerDeletedFile (fileId) {
    var deletedFiles = this.get('deletedFiles') || [];
    if(!this.get('isNew')) {
      deletedFiles.push(fileId);
      this.set('deletedFiles', deletedFiles);
    }
  },

  /**
    Make sure we don't delete files twice.
   */
  clearDeletedFiles: Em.on('didUpdate', function() {
    this.set('deletedFiles', null);
  })
});