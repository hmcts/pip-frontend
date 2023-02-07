import subprocess
import json
from dataclasses import dataclass

header = '''
     ____                          _____           _       __
    / __ \____ _____  ____  __  __/ ___/__________(_)___  / /_
   / / / / __ `/ __ \/ __ \/ / / /\__ \/ ___/ ___/ / __ \/ __/
  / /_/ / /_/ / / / / / / / /_/ /___/ / /__/ /  / / /_/ / /_
 /_____/\__,_/_/ /_/_/ /_/\__, //____/\___/_/  /_/ .___/\__/
                        /____/                 /_/

'''
colors = ['\033[94m', '\033[96m', '\033[92m', '\033[93m', '\033[91m', '\033[95m']
print(f"\n{colors[5]}{header}\nChecking all your code for currently known vulnerabilities and comparing with those you've elected to already suppress...")
print("This should only take a few seconds.")

suppressions = "cat yarn-audit-known-issues"
audit = "yarn npm audit --recursive --json"

@dataclass
class advisory:
  cves: list
  severity: str
  vulnerable_versions: str
  module_name: str
  id: str

  def pretty_print(self, prepend=colors[0]):
    print(prepend, f"Module: {self.module_name}",
          f"{colors[1]}CVE(s): {self.cves}",
          f"{colors[2]}Severity: {self.severity}",
          f"{colors[3]}Vulnerable versions: {self.vulnerable_versions}",
          f"{colors[4]}id: {self.id}", "",
          sep=" || ")

  def ugly_print(self, prepend=colors[5]):
    print(prepend, f"Module: {self.module_name}",
          f"CVE(s): {self.cves}",
          f"Severity: {self.severity}",
          f"Vulnerable versions: {self.vulnerable_versions}",
          f"id: {self.id}", "",
          sep=" || ")


def read_in_json_yarn_v3(audit, cmd):
  current_script = subprocess.Popen([cmd], shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  output = current_script.stdout.read()
  advisoryList = []
  if len(output) == 0:
    if audit:
      print(f"{colors[2]}Nice one! All your dependencies are up to date!")
    else:
      print(f"\n{colors[3]}Note: You have an empty suppressions file.{colors[5]}")
      return []

  current_advisory = json.loads(output.decode('utf-8'))['advisories']
  for i in current_advisory.keys():
    data = current_advisory[i]
    this_advisory = advisory(module_name=data['module_name'],
                             severity=data['severity'].title(),
                             vulnerable_versions=data['vulnerable_versions'],
                             cves=data['cves'],
                             id=data['id'])
    advisoryList.append(this_advisory)
  return advisoryList


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
    decoded_advisory = i.decode('utf-8')
    current_advisory = json.loads(decoded_advisory)
    current_advisory_id = current_advisory['data']['resolution']['id']
    current_advisory_cve = current_advisory['data']['advisory']['cves']
    if current_advisory_id not in current_ids:
      current_ids[current_advisory_id] = current_advisory_cve
  return (current_ids)


audit_results = read_in_json_yarn_v3(True, audit)
suppression_results = read_in_json_yarn_v3(False, suppressions)

unsuppressed = [i for i in audit_results if i not in suppression_results]
unused = [i for i in suppression_results if i not in audit_results]
for i in unused:
  i.ugly_print()

print(f'\n{colors[4]}Warning! You have {len(unsuppressed)} unsuppressed vulnerabilities:')
for i, j in enumerate(unsuppressed):
  j.pretty_print(colors[0] + str(i))


# def yarn_v1_steps():
# for i, j in audit_results.items()
# print(f"New unsuppressed advisory - {i} -> {j}")

# for i, j in suppression_results.items():
#   if i not in audit_results or j not in audit_results.values():
#     print(f"Unused suppression found - {i} -> {j}")
