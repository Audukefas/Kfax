import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class BenfordAnalysisApp {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Welcome to the Benford's Law Analysis Tool!");
        System.out.println("Please enter the election data (comma separated): ");
        String input = scanner.nextLine();
        String[] dataStrings = input.split(",");

        // Parse data into numbers
        double[] data = new double[dataStrings.length];
        for (int i = 0; i < dataStrings.length; i++) {
            data[i] = Double.parseDouble(dataStrings[i].trim());
        }

        // Analyze data
        Map<Integer, Integer> digitCounts = analyzeBenford(data);

        // Display results
        System.out.println("Digit Frequencies According to Benford's Law:");
        for (int i = 1; i <= 9; i++) {
            System.out.printf("Digit %d: %d occurrences (Expected: %.2f%%)\n", i, digitCounts.get(i), expectedFrequency(i));
        }

        scanner.close();
    }

    private static Map<Integer, Integer> analyzeBenford(double[] data) {
        Map<Integer, Integer> digitCounts = new HashMap<>();

        for (int i = 1; i <= 9; i++) {
            digitCounts.put(i, 0);
        }

        for (double number : data) {
            int firstDigit = getFirstDigit(number);
            if (firstDigit != -1) {
                digitCounts.put(firstDigit, digitCounts.get(firstDigit) + 1);
            }
        }

        return digitCounts;
    }

    private static int getFirstDigit(double number) {
        while (number >= 10) {
            number /= 10;
        }
        return (int) number;
    }

    private static double expectedFrequency(int digit) {
        return Math.log10(digit + 1) - Math.log10(digit);
    }
}