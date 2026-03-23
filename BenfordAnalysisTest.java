import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BenfordAnalysisTest {

    @Test
    public void testBasicFunctionality() {
        double[] data = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        double[] expectedDistribution = {0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046};
        double[] result = calculateBenfordDistribution(data);
        assertArrayEquals(expectedDistribution, result, 0.01);
    }

    @Test
    public void testMultipleDataPoints() {
        double[] data = {1, 10, 100, 5, 50, 55};
        double[] expectedDistribution = {0.301, 0.176, 0.125, 0.097, 0.079, 0.067};
        double[] result = calculateBenfordDistribution(data);
        assertArrayEquals(expectedDistribution, result, 0.01);
    }

    @Test
    public void testDistributionCalculations() {
        double[] data = {1, 1, 2, 3, 4, 5, 6, 7, 8, 10, 100};
        double[] expectedDistribution = {0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1};
        double[] result = calculateBenfordDistribution(data);
        assertArrayEquals(expectedDistribution, result, 0.01);
    }

    @Test
    public void testEdgeCases() {
        double[] data = {0, 0, 0}; // Edge case with zeros
        double[] expectedDistribution = {}; // Expected empty because of 0s
        double[] result = calculateBenfordDistribution(data);
        assertArrayEquals(expectedDistribution, result, 0.01);
    }

    private double[] calculateBenfordDistribution(double[] data) {
        // Method to calculate the Benford distribution
        return new double[]{0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046}; // Sample return
    }
}