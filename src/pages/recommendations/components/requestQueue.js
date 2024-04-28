export class RequestQueue {
    constructor(maxConcurrent = 2) {
        this.queue = [];
        this.maxConcurrent = maxConcurrent;
        this.currentlyActive = 0; // Track the number of currently active tasks
        this.onComplete = () => {};  // Callback for when all tasks are completed
    }

    setOnCompleteCallback(callback) {
        this.onComplete = callback;
    }

    enqueue(task) {
        this.queue.push(task);
        this.processQueue();
    }

    async processQueue() {
        // Only start new tasks if we have capacity to handle more
        while (this.currentlyActive < this.maxConcurrent && this.queue.length > 0) {
            this.currentlyActive++;  // Increment active task counter
            const task = this.queue.shift();
            try {
                await task();
            } catch (error) {
                console.error("Failed to process task:", error);
            } finally {
                this.currentlyActive--;  // Decrement active task counter
                if (this.queue.length === 0 && this.currentlyActive === 0) {
                    this.onComplete();  // All tasks are done processing
                }
                this.processQueue();  // Continue processing if there are more tasks
            }
        }
    }
}

export const imageRequestQueue = new RequestQueue();  // Default to 2 concurrent tasks
