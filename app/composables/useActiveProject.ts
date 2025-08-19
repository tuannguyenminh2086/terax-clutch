import { useProjectStore } from '~/stores/project'

export const useActiveProject = () => {
  const projectStore = useProjectStore()
  
  // Return a computed ref to the active project
  return computed(() => projectStore.activeProject)
}
