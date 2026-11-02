@Component
public class SampleTaskInitializer implements CommandLineRunner {
    private final TaskService taskService;

    public SampleTaskInitializer(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public void run(String... args) {
        // move the sample tasks from the TaskService constructor here, e.g.
        // taskService.createTask(new Task(...));
    }
}
