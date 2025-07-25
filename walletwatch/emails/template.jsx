import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
  userName = "",
  type = "budget-alert",
  data = {},
}) {
  if (type === "budget-alert") {
    // Extract values with fallback defaults
    const percentageUsed =
      typeof data.percentageUsed === "number" ? data.percentageUsed : 0;
    const budgetAmount =
      typeof data.budgetAmount === "number" ? data.budgetAmount : 0;
    const totalExpenses =
      typeof data.totalExpenses === "number" ? data.totalExpenses : 0;
    const remaining = budgetAmount - totalExpenses;

    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You’ve used {percentageUsed.toFixed(1)}% of your monthly budget.
            </Text>

            <Section style={styles.statsContainer}>
              <Section style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.text}>${budgetAmount.toFixed(2)}</Text>
              </Section>

              <Section style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.text}>${totalExpenses.toFixed(2)}</Text>
              </Section>

              <Section style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.text}>${remaining.toFixed(2)}</Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
  return null;
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
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
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
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  text: {
    margin: 0,
  },
};