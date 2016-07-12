/* exported onFontLoad */

var onFontLoad = (function() {
  'use strict';

  /*
   * SampleText
   */
  function SampleText(font) {
    this._font = font;
  }

  SampleText.prototype.insert = function() {
    this._span = document.createElement('span');

    this._span.setAttribute('aria-hidden', 'true');
    this._span.innerHTML = this._font.testText;

    this._span.style.display = 'block';
    this._span.style.position = 'absolute';
    this._span.style.top = '-9999px';
    this._span.style.left = '-9999px';
    this._span.style.width = 'auto';
    this._span.style.height = 'auto';
    this._span.style.margin = '0';
    this._span.style.padding = '0';
    this._span.style.whiteSpace = 'nowrap';
    this._span.style.lineHeight = 'normal';
    this._span.style.fontSize = '300px';
    this._span.style.fontVariant = 'normal';
    this._span.style.fontStyle = this._font.style;
    this._span.style.fontWeight = this._font.weight;
    this._span.style.fontFamily = this._font.family;

    document.body.appendChild(this._span);
  };

  SampleText.prototype.remove = function() {
    document.body.removeChild(this._span);
  };

  SampleText.prototype.getWidth = function() {
    return this._span.offsetWidth;
  };

  /*
   * Interval
   */
  function Interval(delay) {
    this._delay = delay;
    this._tasks = [];
  }

  Interval.prototype._generateId = function() {
    return Math.floor(Math.random() * 10000000);
  };

  Interval.prototype._getTaskIndex = function(taskId) {
    for (var i = 0; i < this._tasks.length; i++) {
      if (this._tasks[i].id == taskId) {
        return i;
      }
    }

    return -1;
  };

  Interval.prototype._runTasks = function() {
    for (var i = 0; i < this._tasks.length; i++) {
      this._tasks[i].task();
    }
  };

  Interval.prototype._start = function() {
    this._interval = setInterval(this._runTasks.bind(this), this._delay);
  };

  Interval.prototype._stop = function() {
    clearInterval(this._interval);
    this._interval = undefined;
  };

  Interval.prototype._isRunning = function() {
    return this._interval !== undefined;
  };

  Interval.prototype.register = function(task) {
    var taskId = this._generateId();

    this._tasks.push({id: taskId, task: task});

    if (!this._isRunning()) {
      this._start();
    }

    return taskId;
  };

  Interval.prototype.unregister = function(taskId) {
    var index = this._getTaskIndex(taskId);

    if (index != -1) {
      this._tasks.splice(index, 1);
    }

    if (!this._tasks.length) {
      this._stop();
    }
  };

  /*
   * FontWatcher
   */
  function FontWatcher(interval, font) {
    function makeFont(family) {
      return {
        family: family,
        weight: font.weight || 400,
        style: font.style || 'normal',
        testText: font.testText || 'BESbswy'
      };
    }

    this._interval = interval;

    this._localA = new SampleText(makeFont('serif'));
    this._localB = new SampleText(makeFont('sans-serif'));
    this._stackA = new SampleText(makeFont(font.family + ', serif'));
    this._stackB = new SampleText(makeFont(font.family + ', sans-serif'));
  }

  FontWatcher.prototype.stop = function() {
    if (!this.isDone()) {
      this._interval.unregister(this._intervalId);
      this._intervalId = undefined;

      this._localA.remove();
      this._localB.remove();
      this._stackA.remove();
      this._stackB.remove();
    }
  };

  FontWatcher.prototype._check = function() {
    var loaded = false;

    loaded = loaded || (this._stackA.getWidth() != this._localA.getWidth());
    loaded = loaded || (this._stackB.getWidth() != this._localB.getWidth());
    loaded = loaded && (this._stackA.getWidth() == this._stackB.getWidth());

    if (loaded) {
      this.stop();
    }

    return loaded;
  };

  FontWatcher.prototype.start = function() {
    this._localA.insert();
    this._localB.insert();
    this._stackA.insert();
    this._stackB.insert();

    if (!this._check()) {
      this._intervalId = this._interval.register(this._check.bind(this));
    }
  };

  FontWatcher.prototype.isDone = function() {
    return this._intervalId === undefined;
  };

  /*
   * onFontLoad
   */
  return function (fonts, callback) {
    var interval = new Interval(50),
        startTime = new Date().getTime(),
        watchers = [],
        intervalId;

    for (var i = 0; i < fonts.length; i++) {
        watchers.push(new FontWatcher(interval, fonts[i]));

        watchers[i].start();
    }

    intervalId = interval.register(function() {
      var done = true,
          i;

      for (i = 0; i < watchers.length; i++) {
        done = done && watchers[i].isDone();
      }

      if (done) {
        interval.unregister(intervalId);
        callback(true);
      } else {
        var timedOut = (new Date().getTime() - startTime) > 3000;

        if (timedOut) {
          interval.unregister(intervalId);

          for (i = 0; i < watchers.length; i++) {
            watchers[i].stop();
          }
          callback(false);
        }
      }
    });
  };
})();
