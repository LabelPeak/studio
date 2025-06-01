import { Drawer } from "antd";

import ProjectStatusView from "@/components/ProjectStatusView";
import { Project } from "@/interfaces/project";

interface ProjectStatusDrawerProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

export default function ProjectStatusDrawer({ open, onClose, project }: ProjectStatusDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} width={800}>
      <ProjectStatusView project={project} />
    </Drawer>
  );
}
