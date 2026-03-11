export interface DatasetParquet {
  label: string
  url: string
  grupo: string
}

export type ItemSeletorDataset = DatasetParquet | {
  type: 'label' | 'separator'
  label?: string
}
