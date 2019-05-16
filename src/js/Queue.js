// implementation of a Queue
export default class Queue {
  // creates an empty array to store values of the queue
  constructor() {
    this.mArray = [];
  }

  // pushes something on the end of the queue
  enqueue(e) {
    this.mArray.push(e);
  }

  // removes something from the front
  dequeue() {
    return this.mArray.shift();
  }

  // checks if the queue is empty
  isEmpty() {
    return this.mArray.length === 0;
  }

  // returns the front element; if empty, returns undefined
  peek() {
    return !this.isEmpty() ? this.mArray[0] : undefined;
  }

  // returns size of the queue
  size() {
    return this.mArray.length;
  }
}
