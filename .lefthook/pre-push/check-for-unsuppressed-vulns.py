import subprocess
import json

print("Script running: Checking current vulnerabilities and comparing with current suppressions.")

suppressions = "cat yarn-audit-known-issues"
audit = "yarn audit --json"
def read_in_json(audit, cmd):
  current_script = subprocess.Popen([cmd], shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  output = current_script.stdout.read().splitlines()
  current_ids = {}
  iterator_final_val = len(output)
  if audit:
    if iterator_final_val == 0:
      print("No existing vulnerabilities found - Nice job!")
      exit()
    # yarn audit returns a final json lump at the end of all the advisories - a summary we don't want to use.
    iterator_final_val = -1
  for i in output[:iterator_final_val]:
    current_advisory = json.loads(i.decode('utf-8'))
    current_advisory_id = current_advisory['data']['resolution']['id']
    current_advisory_cve = current_advisory['data']['advisory']['cves']
    if current_advisory_id not in current_ids:
      current_ids[current_advisory_id] = current_advisory_cve
  return(current_ids)

audit_results = read_in_json(True, audit)
suppression_results = read_in_json(False, suppressions)

for i, j in audit_results.items():
  if i not in suppression_results or j not in suppression_results.values():
    print(f"New unsuppressed advisory - {i} -> {j}")
