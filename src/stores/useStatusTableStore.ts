import { create } from 'zustand';

interface StatusTableState {
  // Search states
  searchTerm: string;
  batchSearchTerm: string;
  
  // Filter states
  emailFilter: string;
  internalTab: number;
  
  // Pagination states
  page: number;
  rowsPerPage: number;
  
  // Selection states
  selectedItems: Set<number>;
  
  // UI states
  expandedRows: Set<number>;
  expanded: boolean;
  
  // Data and configuration
  items: Array<any>;
  color: string;
  statusId: string;
  showBulkActions: boolean;
  showEmailFilter: boolean;
  onBulkUpdate?: (ids: number[]) => Promise<void>;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setBatchSearchTerm: (term: string) => void;
  setEmailFilter: (filter: string) => void;
  setInternalTab: (tab: number) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setSelectedItems: (items: Set<number>) => void;
  toggleSelectedItem: (id: number) => void;
  clearSelectedItems: () => void;
  setExpandedRows: (rows: Set<number>) => void;
  toggleExpandedRow: (id: number) => void;
  setExpanded: (expanded: boolean) => void;
  
  // Reset actions
  resetSearchFields: () => void;
  resetAllStates: () => void;
  resetTabStates: () => void;
  resetTabStatesButKeepCurrentTab: () => void;
  
  // Configuration action
  setTableConfig: (config: {
    items: any[];
    color: string;
    statusId: string;
    showBulkActions: boolean;
    showEmailFilter: boolean;
    onBulkUpdate?: (ids: number[]) => Promise<void>;
  }) => void;
}

export const useStatusTableStore = create<StatusTableState>((set, get) => ({
  // Initial states
  searchTerm: '',
  batchSearchTerm: '',
  emailFilter: 'AC',
  internalTab: 0,
  page: 0,
  rowsPerPage: 25,
  selectedItems: new Set<number>(),
  expandedRows: new Set<number>(),
  expanded: false,
  
  // Data and configuration initial values
  items: [],
  color: '#4caf50',
  statusId: '',
  showBulkActions: false,
  showEmailFilter: false,
  onBulkUpdate: undefined,

  // Search actions
  setSearchTerm: (term: string) => set({ searchTerm: term, page: 0 }),
  setBatchSearchTerm: (term: string) => set({ batchSearchTerm: term, page: 0 }),
  
  // Filter actions
  setEmailFilter: (filter: string) => set({ 
    emailFilter: filter, 
    page: 0,
    searchTerm: '',
    batchSearchTerm: '',
    selectedItems: new Set<number>()
  }),
  setInternalTab: (tab: number) => set({ 
    internalTab: tab, 
    page: 0,
    searchTerm: '',
    batchSearchTerm: '',
    selectedItems: new Set<number>()
  }),
  
  // Pagination actions
  setPage: (page: number) => set({ page }),
  setRowsPerPage: (rowsPerPage: number) => set({ rowsPerPage, page: 0 }),
  
  // Selection actions
  setSelectedItems: (items: Set<number>) => set({ selectedItems: items }),
  toggleSelectedItem: (id: number) => {
    const currentSelected = get().selectedItems;
    const newSelected = new Set(currentSelected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    set({ selectedItems: newSelected });
  },
  clearSelectedItems: () => set({ selectedItems: new Set<number>() }),
  
  // UI actions
  setExpandedRows: (rows: Set<number>) => set({ expandedRows: rows }),
  toggleExpandedRow: (id: number) => {
    const currentExpanded = get().expandedRows;
    const newExpanded = new Set(currentExpanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    set({ expandedRows: newExpanded });
  },
  setExpanded: (expanded: boolean) => set({ expanded }),
  
  // Reset actions
  resetSearchFields: () => set({
    searchTerm: '',
    batchSearchTerm: '',
    page: 0
  }),
  
  resetTabStates: () => set({
    searchTerm: '',
    batchSearchTerm: '',
    page: 0,
    selectedItems: new Set<number>(),
    internalTab: 0
  }),
  
  resetTabStatesButKeepCurrentTab: () => set((state) => ({
    searchTerm: '',
    batchSearchTerm: '',
    page: 0,
    selectedItems: new Set<number>(),
    internalTab: state.internalTab // Keep current tab
  })),
  
  resetAllStates: () => set({
    searchTerm: '',
    batchSearchTerm: '',
    emailFilter: 'AC',
    internalTab: 0,
    page: 0,
    rowsPerPage: 25,
    selectedItems: new Set<number>(),
    expandedRows: new Set<number>(),
    expanded: false,
    items: [],
    color: '#4caf50',
    statusId: '',
    showBulkActions: false,
    showEmailFilter: false,
    onBulkUpdate: undefined
  }),
  
  // Configuration action implementation
  setTableConfig: ({ items, color, statusId, showBulkActions, showEmailFilter, onBulkUpdate }) => set({
    items,
    color,
    statusId,
    showBulkActions,
    showEmailFilter,
    onBulkUpdate,
    // Reset pagination and selection when data changes
    page: 0,
    selectedItems: new Set(),
    searchTerm: '',
    batchSearchTerm: '',
  })
}));
