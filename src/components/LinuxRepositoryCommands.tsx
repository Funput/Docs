import CodeBlock from '@theme/CodeBlock';
import type {FamilyId} from './DistroPicker';

const commands: Record<FamilyId, string> = {
  debian: `sudo install -d /usr/share/keyrings
curl -fsSL https://repo.funput.app/funput.asc | sudo tee /usr/share/keyrings/funput.asc >/dev/null
sudo tee /etc/apt/sources.list.d/funput.sources >/dev/null <<'REPO'
Types: deb
URIs: https://repo.funput.app/deb
Suites: ./
Signed-By: /usr/share/keyrings/funput.asc
REPO
sudo apt update`,
  fedora: `sudo curl -fsSL https://repo.funput.app/funput.repo -o /etc/yum.repos.d/funput.repo`,
  suse: `sudo rpm --import https://repo.funput.app/funput.asc
sudo zypper addrepo -gf https://repo.funput.app/rpm/ funput
sudo zypper refresh`,
  arch: `curl -fsSL https://repo.funput.app/funput.asc | sudo pacman-key --add -
sudo pacman-key --lsign-key hello@funput.app
sudo tee -a /etc/pacman.conf <<'REPO'

[funput]
Server = https://repo.funput.app/arch/$arch
REPO`,
};

export default function LinuxRepositoryCommands({family}: {family: FamilyId}) {
  return <CodeBlock language="bash">{commands[family]}</CodeBlock>;
}
