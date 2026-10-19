package com.daybuilder.model;

public class Task {
    private final Long id;
    private final String title;
    private final String description;
    private final boolean completed;

    // Kept so Spring can turn incoming JSON into a Task
    public Task(Long id, String title, String description, boolean completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    // Used by the Builder
    private Task(Builder b) {
        this.id = b.id;
        this.title = b.title;
        this.description = b.description;
        this.completed = b.completed;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public boolean isCompleted() { return completed; }

    // Builder pattern: assemble a Task step by step with named methods
    public static class Builder {
        private Long id;
        private String title;
        private String description = "";
        private boolean completed;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder completed(boolean completed) { this.completed = completed; return this; }

        public Task build() {
            if (title == null) {
                throw new IllegalStateException("no title");
            }
            return new Task(this);
        }
    }
}
