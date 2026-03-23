import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

public class BenfordAnalysis {
    
    // Method for digit extraction
    public static List<Integer> extractDigits(List<Double> numbers) {
        List<Integer> digits = new ArrayList<>();
        for (double number : numbers) {
            String str = String.valueOf(number);
            if (str.charAt(0) != '-') {
                digits.add(Integer.parseInt(String.valueOf(str.charAt(0))));
            }
        }
        return digits;
    }

    // Method for frequency distribution
    public static Map<Integer, Double> frequencyDistribution(List<Integer> digits) {
        Map<Integer, Double> freq = new HashMap<>();
        for (int digit : digits) {
            freq.put(digit, freq.getOrDefault(digit, 0.0) + 1);
        }
        double total = digits.size();
        for (int key : freq.keySet()) {
            freq.put(key, freq.get(key) / total);
        }
        return freq;
    }

    // Method for Chi-squared test
    public static double chiSquaredTest(Map<Integer, Double> observed) {
        double chiSquared = 0.0;
        Map<Integer, Double> expected = new HashMap<>();
        expected.put(1, 0.301);
        expected.put(2, 0.176);
        expected.put(3, 0.125);
        expected.put(4, 0.097);
        expected.put(5, 0.079);
        expected.put(6, 0.067);
        expected.put(7, 0.058);
        expected.put(8, 0.051);
        expected.put(9, 0.046);
        
        for (int key : expected.keySet()) {
            double obs = observed.getOrDefault(key, 0.0);
            double exp = expected.get(key);
            chiSquared += Math.pow(obs - exp, 2) / exp;
        }
        return chiSquared;
    }

    // Placeholder for Kolmogorov-Smirnov test (implementation pending)
    public static double kolmogorovSmirnovTest(List<Integer> digits) {
        // Implementation would go here
        return 0; // Placeholder
    }

    // Method for report generation
    public static String generateReport(Map<Integer, Double> frequencyDist, double chiSquared, double ksStatistic) {
        StringBuilder report = new StringBuilder("Benford's Law Analysis Report\n");
        report.append("Frequency Distribution:\n");
        for (Map.Entry<Integer, Double> entry : frequencyDist.entrySet()) {
            report.append("Digit ").append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
        }
        report.append("Chi-Squared Statistic: ").append(chiSquared).append("\n");
        report.append("Kolmogorov-Smirnov Statistic: ").append(ksStatistic).append("\n");
        return report.toString();
    }

    // Main method for testing purposes
    public static void main(String[] args) {
        // Example usage
    }
}