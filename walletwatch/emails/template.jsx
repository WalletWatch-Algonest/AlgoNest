import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "Shweta Singh",
  type = "monthly-report",
  data = {},
}) {
  // Set dummy data if none provided
  const dummyMonthlyData = {
    month: "July 2025",
    stats: {
      totalIncome: 10000,
      totalExpenses: 7400,
      byCategory: {
        Rent: 3000,
        Groceries: 1200,
        Entertainment: 800,
        Travel: 1000,
        Miscellaneous: 1400,
      },
    },
    insights: [
      "You saved 26% of your income this month.",
      "Entertainment expenses increased by 10% compared to last month.",
      "You're close to your grocery budget limit.",
    ],
  };

  const dummyBudgetAlertData = {
    budgetAmount: 8000,
    totalExpenses: 7400,
    percentageUsed: (7400 / 8000) * 100,
  };

  const isMonthly = type === "monthly-report";
  const isBudgetAlert = type === "budget-alert";
  const report = isMonthly ? { ...dummyMonthlyData, ...data } : {};
  const alert = isBudgetAlert ? { ...dummyBudgetAlertData, ...data } : {};

  return (
    <Html>
      <Head />
      <Preview>
        {isMonthly ? "Your Monthly Financial Report" : "Budget Alert"}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.title}>
            {isMonthly ? "Monthly Financial Report" : "Budget Alert"}
          </Heading>

          <Text style={styles.text}>Hello {userName},</Text>

          {isMonthly && (
            <>
              <Text style={styles.text}>
                Here&rsquo;s your financial summary for {report.month}:
              </Text>

              <Section style={styles.statsContainer}>
                <div style={styles.stat}>
                  <Text style={styles.text}>Total Income</Text>
                  <Text style={styles.heading}>${report.stats.totalIncome}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Total Expenses</Text>
                  <Text style={styles.heading}>${report.stats.totalExpenses}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Net</Text>
                  <Text style={styles.heading}>
                    ${report.stats.totalIncome - report.stats.totalExpenses}
                  </Text>
                </div>
              </Section>

              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(report.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={styles.text}>{category}</Text>
                      <Text style={styles.text}>${amount}</Text>
                    </div>
                  )
                )}
              </Section>

              <Section style={styles.section}>
                <Heading style={styles.heading}>WalletWatch Insights</Heading>
                {report.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            </>
          )}

          {isBudgetAlert && (
            <>
              <Text style={styles.text}>
                You’ve used {alert.percentageUsed.toFixed(1)}% of your monthly budget.
              </Text>

              <Section style={styles.statsContainer}>
                <div style={styles.stat}>
                  <Text style={styles.text}>Budget Amount</Text>
                  <Text style={styles.heading}>${alert.budgetAmount.toFixed(2)}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Spent So Far</Text>
                  <Text style={styles.heading}>${alert.totalExpenses.toFixed(2)}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Remaining</Text>
                  <Text style={styles.heading}>
                    ${(alert.budgetAmount - alert.totalExpenses).toFixed(2)}
                  </Text>
                </div>
              </Section>
            </>
          )}

          <Text style={styles.footer}>
            Thank you for using WalletWatch. Keep tracking your finances for better
            financial health!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    marginBottom: "16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
