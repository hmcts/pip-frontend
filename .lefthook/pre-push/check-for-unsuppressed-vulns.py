import subprocess
import json
from dataclasses import dataclass

header = '''
           _      _____           _       __
    ____  (_)___ / ___/__________(_)___  / /_
   / __ \/ / __ \\__ \/ ___/ ___/ / __ \/ __/
  / /_/ / / /_/ /__/ / /__/ /  / / /_/ / /_
 / .___/_/ .___/____/\___/_/  /_/ .___/\__/
/_/     /_/                    /_/

'''
colors = ['\033[94m', '\033[96m', '\033[92m', '\033[93m', '\033[91m', '\033[95m']
print(
  f"\n{colors[5]}{header}\nChecking all your code for currently known vulnerabilities and comparing with those you've elected to already suppress...")
print("This should only take a few seconds.")

audit = "yarn npm audit --recursive --json"
suppressions = "cat yarn-audit-known-issues"

@dataclass
class advisory:
  severity: str
  vulnerable_versions: str
  module_name: str
  id: str

  def pretty_print(self, prepend=colors[0]):
    print(prepend, f"Module: {self.module_name}",
          f"{colors[2]}Severity: {self.severity}",
          f"{colors[3]}Vulnerable versions: {self.vulnerable_versions}",
          f"{colors[4]}id: {self.id}", "",
          sep=" || ")

  def ugly_print(self, prepend=colors[5]):
    print(prepend, f"Module: {self.module_name}",
          f"Severity: {self.severity}",
          f"Vulnerable versions: {self.vulnerable_versions}",
          f"id: {self.id}", "",
          sep=" || ")


def handle_empty_bodies(audit, output):
  if len(output) == 0:
    if audit:
      print(f"{colors[2]}Nice one! All your dependencies are up to date!")
      return False
    else:
      print(f"\n{colors[3]}Note: You have an empty suppressions file.{colors[5]}")
      return True
  return False


def getRawData(cmd):
  current_script = subprocess.Popen([cmd], shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  return current_script.stdout.read()


def build_advisory(data):
  return advisory(module_name=data['value'],
                  severity=data['children']['Severity'],
                  vulnerable_versions=data['children']['Vulnerable Versions'],
                  id=data['children']['ID'])

def read_in_json_yarn_v4(audit, cmd):
  output = getRawData(cmd)
  advisoryList = []
  empty_files = handle_empty_bodies(audit, output)
  if empty_files:
    return advisoryList

  advisories = []
  for line in output.splitlines():
    advisories.append(json.loads(line))

  for advisory in advisories:
    advisoryList.append(build_advisory(advisory))
  return advisoryList


def run_audit_and_suppression_checks():
  audit_results = read_in_json_yarn_v4(True, audit)
  suppression_results = read_in_json_yarn_v4(False, suppressions)

  unsuppressed = [i for i in audit_results if i not in suppression_results]
  unused = [i for i in suppression_results if i not in audit_results]
  return unsuppressed, unused

def print_outputs(unsuppressed, unused):
  for i in unused:
    print(f'\n{colors[0]}Note: You have {len(unused)} unused suppressions - you can probably delete those safely.')
    i.ugly_print()

  print(f'\n{colors[4]}Warning! You have {len(unsuppressed)} unsuppressed vulnerabilities:')
  for i, j in enumerate(unsuppressed):
    j.pretty_print(colors[0] + str(i))

print_outputs(*run_audit_and_suppression_checks())
