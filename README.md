# RecoverAI

RecoverAI is an AI-powered revenue recovery agent designed to help merchants identify recoverable payment failures and safely automate recovery workflows.

## Problem

Merchants lose revenue when legitimate payment attempts fail due to temporary payment issues, network failures, and abandoned payment attempts.

## Solution

RecoverAI:

- Detects recoverable payment failures
- Calculates recovery opportunities
- Recommends safe actions
- Validates actions with policy guardrails
- Executes bounded workflows
- Maintains audit logs

## Tech Stack

- React
- Node.js
- Express.js
- PostgreSQL
- AI Agent / LLM



                    RECOVERAI
                        │
                        ▼
                 1. Payment Data
                        │
                        ▼
                 2. Failure Event
                        │
                        ▼
                 3. AI Analysis
                        │
                        ▼
                 4. Recovery Decision
                        │
                        ▼
                 5. Policy Guardrails
                        │
                        ▼
                 6. Recovery Action
                        │
                        ▼
                 7. Audit Log
                        │
                        ▼
                 8. PostgreSQL
                        │
                        ▼
                 9. React Dashboard
                        │
                        ▼
                 10. Evaluation



                 {"transaction":{"id":"TXN_1005","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"decision":{"classification":"RECOVERABLE","recoveryScore":85,"recommendedAction":"RETRY","confidence":0.85,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"recoverable_failure","impact":30},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":0}]},"policy":{"decision":"APPROVE","action":"RETRY","reason":"All recovery policies passed"}}%                                                    
sompallijayadeep@sompallis-MacBook-Air server % curl -X POST http://localhost:3000/api/recovery/TXN_1006/analyze
{"transaction":{"id":"TXN_1006","customerId":"CUS_106","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"decision":{"classification":"NOT_RECOVERABLE","recoveryScore":23,"recommendedAction":"HUMAN_REVIEW","confidence":0.23,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"recoverable_failure","impact":30},{"factor":"customer_success_rate","impact":8},{"factor":"chargebacks","impact":-15},{"factor":"previous_recoveries","impact":0},{"factor":"retry_history","impact":0}]},"policy":{"decision":"APPROVE","action":"HUMAN_REVIEW","reason":"All recovery policies passed"}}%                                      
sompallijayadeep@sompallis-MacBook-Air server % curl -X POST http://localhost:3000/api/recovery/TXN_1007/analyze
{"transaction":{"id":"TXN_1007","customerId":"CUS_105","amount":50000,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"decision":{"classification":"RECOVERABLE","recoveryScore":75,"recommendedAction":"RETRY","confidence":0.75,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"recoverable_failure","impact":30},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":0},{"factor":"high_transaction_amount","impact":-10}]},"policy":{"decision":"REVIEW","action":"HUMAN_REVIEW","reason":"Transaction amount exceeds automatic recovery limit"}}%                                                 
sompallijayadeep@sompallis-MacBook-Air server % 


{"transaction":{"id":"TXN_1008","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":2},"decision":{"classification":"RECOVERABLE","recoveryScore":70,"recommendedAction":"RETRY","confidence":0.7,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"recoverable_failure","impact":30},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":-15}]},"policy":{"decision":"BLOCK","action":"NONE","reason":"Maximum retry attempts reached"}}%       



           // using llm response 
           sompallijayadeep@sompallis-MacBook-Air server % curl -X POST http://localhost:3000/api/recovery/TXN_1005/analyze
{"transaction":{"id":"TXN_1005","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":85,"recommendedAction":"RETRY","confidence":0.85,"reason":"Temporary AI decision generated from baseline context"},"policy":{"decision":"APPROVE","action":"RETRY","reason":"All recovery policies passed"}}%                                                                       
sompallijayadeep@sompallis-MacBook-Air server % curl -X POST http://localhost:3000/api/recovery/TXN_1006/analyze
{"transaction":{"id":"TXN_1006","customerId":"CUS_106","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_106","paymentHistory":{"totalPayments":10,"successfulPayments":3,"failedPayments":7,"successRate":0.3},"riskSignals":{"chargebacks":2},"recoveryHistory":{"previousRecoveries":0},"spending":{"totalSpent":30000,"averageTransactionAmount":3000}},"aiDecision":{"classification":"NOT_RECOVERABLE","recoveryScore":23,"recommendedAction":"HUMAN_REVIEW","confidence":0.23,"reason":"Temporary AI decision generated from baseline context"},"policy":{"decision":"REVIEW","action":"HUMAN_REVIEW","reason":"Recovery requires human review"}}%                                                    
sompallijayadeep@sompallis-MacBook-Air server % curl -X POST http://localhost:3000/api/recovery/TXN_1007/analyze
{"transaction":{"id":"TXN_1007","customerId":"CUS_105","amount":50000,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":75,"recommendedAction":"RETRY","confidence":0.75,"reason":"Temporary AI decision generated from baseline context"},"policy":{"decision":"REVIEW","action":"HUMAN_REVIEW","reason":"Transaction amount exceeds automatic recovery limit"}}%                                         
sompallijayadeep@sompallis-







Step 3 — Don't choose the cloud provider blindly

Since this project is specifically for a Razorpay internship, I want us to choose the model based on:

structured JSON reliability
latency
cost
ease of setup
developer access
ability to constrain output

We can use an appropriate current API once we decide.

And because this involves OpenAI/API information,
 I need to verify the current official API documentation before giving you provider-specific code.









           LLM output 

           {"transaction":{"id":"TXN_1005","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":92,"recommendedAction":"RETRY","confidence":0.8,"reason":"High recovery score due to low chargeback risk, high customer success rate, and previous recoveries. The customer has a good payment history and a high spending amount, indicating a low likelihood of future failures."},"policy":{"decision":"APPROVE","action":"RETRY","reason":"All recovery policies passed"}}%   





          {"transaction":{"id":"TXN_1006","customerId":"CUS_106","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_106","paymentHistory":{"totalPayments":10,"successfulPayments":3,"failedPayments":7,"successRate":0.3},"riskSignals":{"chargebacks":2},"recoveryHistory":{"previousRecoveries":0},"spending":{"totalSpent":30000,"averageTransactionAmount":3000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":64,"recommendedAction":"RETRY","confidence":0.8,"reason":"The customer has a history of failed payments, but their success rate is relatively high. The failure reason is a network timeout, which may be a one-time issue. A retry is recommended to confirm the payment was not successful due to a temporary issue."},"policy":{"decision":"APPROVE","action":"RETRY","reason":"All recovery policies passed"}}%   



        {"transaction":{"id":"TXN_1007","customerId":"CUS_105","amount":50000,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"High customer success rate, no chargebacks, and previous recoveries indicate a recoverable failure. The customer has a history of successful payments and has not had any chargebacks, which suggests that the issue is likely a temporary network timeout. Retrying the payment is recommended to resolve the issue."},"policy":{"decision":"REVIEW","action":"HUMAN_REVIEW","reason":"Transaction amount exceeds automatic recovery limit"}}%



        {"transaction":{"id":"TXN_1008","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":2},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":85,"recommendedAction":"RETRY","confidence":0.8,"reason":"High recovery score due to low retry history and no chargebacks, combined with a good customer success rate and previous recoveries. The failure reason is a network timeout, which may be resolved with a retry."},"policy":{"decision":"BLOCK","action":"NONE","reason":"Maximum retry attempts reached"}}%   


         {"transaction":{"id":"TXN_1009","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"INSUFFICIENT_FUNDS","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"Customer has a high success rate, no chargebacks, and a sufficient recovery history. The failure reason is due to insufficient funds, which is a common issue. Retrying the payment is recommended to resolve the issue."},"policy":{"decision":"BLOCK","action":"NONE","reason":"Failure type is not eligible for automatic recovery"}}%         
              


                                 after strong conducion on policy

       {"transaction":{"id":"TXN_1007","customerId":"CUS_105","amount":50000,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"High customer success rate, no chargebacks, and previous recoveries indicate a recoverable failure. The customer has a history of successful payments and has not had any chargebacks, which suggests that the issue is likely a temporary network timeout. Retrying the payment is recommended to resolve the issue."},"policy":{"decision":"REVIEW","action":"HUMAN_REVIEW","reason":"Transaction amount exceeds automatic recovery limit"}}%     
        sompallijayadeep@sompallis-MacBook-Air server %



        "transaction":{"id":"TXN_1008","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":2},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":85,"recommendedAction":"RETRY","confidence":0.8,"reason":"High recovery score due to low retry history and no chargebacks, combined with a good customer success rate and previous recoveries. The failure reason is a network timeout, which may be resolved with a retry."},"policy":{"decision":"BLOCK","action":"NONE","reason":"Maximum retry attempts reached"}}%  



         {"transaction":{"id":"TXN_1009","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"INSUFFICIENT_FUNDS","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"Customer has a high success rate, no chargebacks, and a sufficient recovery history. The failure reason is due to insufficient funds, which is a common issue. Retrying the payment is recommended to resolve the issue."},"policy":{"decision":"BLOCK","action":"NONE","reason":"Failure type is not eligible for automatic recovery"}}% 






                  after adding base line recomadations visible 

                     "transaction":{"id":"TXN_1009","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"INSUFFICIENT_FUNDS","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"baseline":{"classification":"NOT_RECOVERABLE","recoveryScore":15,"recommendedAction":"HUMAN_REVIEW","confidence":0.15,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"non_recoverable_failure","impact":-40},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":0}]},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"Customer has a high success rate, no chargebacks, and a sufficient recovery history. The failure reason is due to insufficient funds, which is a common issue. Retrying the payment is recommended to resolve the issue."},"policy":{"decision":"BLOCK","action":"NONE","reason":"Failure type is not eligible for automatic recovery"}}%                             
                     

                     ater adding comparsion 

                     {"transaction":{"id":"TXN_1009","customerId":"CUS_105","amount":4999,"currency":"INR","status":"FAILED","failureReason":"INSUFFICIENT_FUNDS","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"baseline":{"classification":"NOT_RECOVERABLE","recoveryScore":15,"recommendedAction":"HUMAN_REVIEW","confidence":0.15,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"non_recoverable_failure","impact":-40},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":0}]},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"Customer has a high success rate, no chargebacks, and a sufficient recovery history. The failure reason is due to insufficient funds, which is a common issue. Retrying the payment is recommended to resolve the issue."},"comparison":{"classificationAgreement":false,"actionAgreement":false,"scoreDifference":65,"severity":"HIGH"},"policy":{"decision":"BLOCK","action":"NONE","reason":"Failure type is not eligible for automatic recovery"}}%   



                     after adding audit 


                     e_failure","impact":30},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":0},{"factor":"high_transaction_amount","impact":-10}]},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"High customer success rate, no chargebacks, and previous recoveries indicate a recoverable failure. The customer has a history of successful payments and has not had any chargebacks, which suggests that the issue is likely a temporary network timeout. Retrying the payment is recommended to resolve the issue."},"comparison":{"classificationAgreement":true,"actionAgreement":true,"scoreDifference":5,"severity":"LOW"},"policy":{"decision":"REVIEW","action":"HUMAN_REVIEW","reason":"Transaction amount exceeds automatic recovery limit"},"auditId":"AUDIT_3"}%             



        curl -X POST http://localhost:3000/api/recovery/TXN_1008/analyze

        curl -X POST http://localhost:3000/api/recovery/TXN_1009/analyze


 5,"recommendedAction":"HUMAN_REVIEW","confidence":0.15,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"non_recoverable_failure","impact":-40},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":0}]},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8,"reason":"Customer has a high success rate, no chargebacks, and a sufficient recovery history. The failure reason is due to insufficient funds, which is a common issue. Retrying the payment is recommended to resolve the issue."},"comparison":{"classificationAgreement":false,"actionAgreement":false,"scoreDifference":65,"severity":"HIGH"},"policy":{"decision":"BLOCK","action":"NONE","reason":"Failure type is not eligible for automatic recovery"},"auditId":"AUDIT_1"}%  


                       [{"id":"AUDIT_1","timestamp":"2026-08-25T13:37:16.705Z","transactionId":"TXN_1009","baseline":{"classification":"NOT_RECOVERABLE","recoveryScore":15,"recommendedAction":"HUMAN_REVIEW","confidence":0.15},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":80,"recommendedAction":"RETRY","confidence":0.8},"comparison":{"classificationAgreement":false,"actionAgreement":false,"scoreDifference":65,"severity":"HIGH"},"policy":{"decision":"BLOCK","action":"NONE","reason":"Failure type is not eligible for automatic recovery"}}]%       


                        classification":"RECOVERABLE","recoveryScore":85,"recommendedAction":"RETRY","confidence":0.85,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"recoverable_failure","impact":30},{"factor":"customer_success_rate","impact":25},{"factor":"no_chargebacks","impact":15},{"factor":"previous_recoveries","impact":15},{"factor":"retry_history","impact":0}]},"aiDecision":{"classification":"RECOVERABLE","recoveryScore":92,"recommendedAction":"RETRY","confidence":0.8,"reason":"High recovery score due to low chargeback risk, high customer success rate, and previous recoveries. The customer has a good payment history and a high spending amount, indicating a low likelihood of future failures."},"comparison":{"classificationAgreement":true,"actionAgreement":true,"scoreDifference":7,"severity":"LOW"},"policy":{"decision":"APPROVE","action":"RETRY","reason":"All recovery policies passed"},"auditId":"AUDIT_2"}%    


                          {"transaction":{"id":"TXN_1007","customerId":"CUS_105","amount":50000,"currency":"INR","status":"FAILED","failureReason":"NETWORK_TIMEOUT","retryCount":0},"customer":{"id":"CUS_105","paymentHistory":{"totalPayments":20,"successfulPayments":20,"failedPayments":0,"successRate":1},"riskSignals":{"chargebacks":0},"recoveryHistory":{"previousRecoveries":6},"spending":{"totalSpent":100000,"averageTransactionAmount":5000}},"baseline":{"classification":"RECOVERABLE","recoveryScore":75,"recommendedAction":"RETRY","confidence":0.75,"reason":"Decision generated from recovery scoring baseline","factors":[{"factor":"recoverabl