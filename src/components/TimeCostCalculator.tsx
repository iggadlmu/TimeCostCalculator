import React, { useState } from 'react';
import { DollarSign, Clock, ShoppingCart, Calculator, Hourglass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { InputField } from './InputField';

// Define the structure of the result
interface CalculationResult {
  isRecurring: boolean;
  hourlyRate: string;
  monthlyHours?: string;
  monthlyDays?: string;
  yearlyHours?: string;
  yearlyDays?: string;
  hours?: string;
  days?: string;
}

const TimeCostCalculator = () => {
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [dailyHours, setDailyHours] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null); // Use CalculationResult type
  const [error, setError] = useState<string | null>(null); // Specify error type

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setYearlyIncome(value);
  };

  const validateInputs = () => {
    const income = parseFloat(yearlyIncome);
    const hours = parseFloat(dailyHours);
    const price = parseFloat(itemPrice);

    if (!yearlyIncome) return "Enter your annual net income";
    if (!dailyHours) return "What are your daily work hours?";
    if (!itemPrice) return "Enter the price as a whole number, without cents";
    
    if (isNaN(income) || income <= 0) return "Please enter a valid yearly income";
    if (isNaN(hours) || hours <= 0 || hours > 24) return "Please enter valid daily hours (between 0 and 24)";
    if (isNaN(price) || price <= 0) return "Please enter a valid price";

    return null;
  };

  const calculateWorkingHours = () => {
    setError(null);
    const validationError = validateInputs();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const yearlyIncomeNum = parseFloat(yearlyIncome);
    const dailyHoursNum = parseFloat(dailyHours);
    const price = parseFloat(itemPrice);
    const userAnnualHours = dailyHoursNum * 5 * 52;
    const hourlyEarnings = yearlyIncomeNum / userAnnualHours;

    if (isRecurring) {
      const monthlyWorkingHours = price / hourlyEarnings;
      const yearlyWorkingHours = monthlyWorkingHours * 12;
      
      setResult({
        isRecurring: true,
        monthlyHours: monthlyWorkingHours.toFixed(1),
        monthlyDays: (monthlyWorkingHours / dailyHoursNum).toFixed(1),
        yearlyHours: yearlyWorkingHours.toFixed(1),
        yearlyDays: (yearlyWorkingHours / dailyHoursNum).toFixed(1),
        hourlyRate: hourlyEarnings.toFixed(2)
      });
    } else {
      const workingHours = price / hourlyEarnings;
      
      setResult({
        isRecurring: false,
        hours: workingHours.toFixed(1),
        days: (workingHours / dailyHoursNum).toFixed(1),
        hourlyRate: hourlyEarnings.toFixed(2)
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Hourglass className="w-6 h-6 text-primary" />
          Time is Money Calculator
        </CardTitle>
        <CardDescription>
          Discover the time price tag of your purchases before you reach for your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputField
          id="yearly-income"
          label="Annual Net Income"
          icon={<DollarSign className="w-4 h-4" />}
          value={yearlyIncome}
          onChange={handleIncomeChange}
          placeholder="Enter your annual net income"
        />

        <InputField
          id="daily-hours"
          label="Daily Working Hours"
          icon={<Clock className="w-4 h-4" />}
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
          placeholder="What are your daily work hours?"
          type="number"
          min="0"
          max="24"
        />

        <InputField
          id="item-price"
          label="Product/Service Price"
          icon={<ShoppingCart className="w-4 h-4" />}
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          placeholder="Enter the price as a whole number, without cents"
          type="number"
          min="0"
        />

        <div className="flex items-center space-x-2 bg-secondary/50 p-3 rounded-lg">
          <Checkbox 
            id="recurring" 
            checked={isRecurring} 
            onCheckedChange={setIsRecurring}
            className="bg-background border-primary"
          />
          <Label htmlFor="recurring" className="text-sm font-medium cursor-pointer">
            Recurring Monthly Payment
          </Label>
        </div>

        <Button
          onClick={calculateWorkingHours}
          className="w-full"
          variant="default"
        >
          <Clock className="w-4 h-4 mr-2" />
          Show Me The Time Price Tag
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && !error && (
          <Alert className="bg-primary/10 border-primary">
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Your hourly earnings: {formatCurrency(result.hourlyRate)}/hour
                </p>
                
                <p className="font-medium text-primary flex items-center">
                  The time price tag: <Clock className="w-4 h-4 ml-1" />
                </p>

                {result.isRecurring ? (
                  <>
                    <p>Monthly: {result.monthlyHours} hours on the job ({result.monthlyDays} shifts of {dailyHours} hours)</p>
                    <p>Yearly: {result.yearlyHours} hours on the job ({result.yearlyDays} shifts of {dailyHours} hours)</p>
                  </>
                ) : (
                  <p>{result.hours} hours on the job ({result.days} shifts of {dailyHours} hours)</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeCostCalculator;
