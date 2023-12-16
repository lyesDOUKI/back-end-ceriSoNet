class Publication {
  
    constructor(data) {
      this._id = data._id;
      this.date = data.date;
      this.hour = data.hour;
      this.body = data.body;
      this.createdBy = typeof data.createdBy === 'number' ? data.createdBy : Number(data.createdBy);
      this.shared = data.shared || data.shared;
      this.images = data.images || [];
      this.title = data.title;
      this.likes = data.likes;
      this.hashtags = data.hashtags || [];
      this.comments = data.comments || [];
    }
  }
  
  class Comment {
    constructor(data) {
      this.commentedBy = data.commentedBy;
      this.text = data.text;
      this.date = data.date;
      this.hour = data.hour;
    }
  }

module.exports = {Publication, Comment};