interface Context {
    domain: string
    country: string
    city: string
    action: Actions
    core_version: string
    bap_id: string
    bap_uri: string
    bpp_id: string
    bpp_uri: string
    transaction_id: string
    message_id: string
    timestamp: string // in RFC3339 format. example : "2021-03-22T11:14:34.072Z" new Date().toISOString()
    key: string
    ttl: string
}

type Actions =
    "search" |
    "select" |
    "init" |
    "confirm" |
    "update" |
    "status" |
    "track" |
    "cancel" |
    "feedback" |
    "support" |
    "on_search" |
    "on_select" |
    "on_init" |
    "on_confirm" |
    "on_update" |
    "on_status" |
    "on_track" |
    "on_cancel" |
    "on_feedback" |
    "on_support" |
    "ack"

interface ProviderForIntent {
    id: string
    descriptor: Descriptor
    locations: [
        {
            id: string
        }
    ]
}

interface Descriptor {
    name: string
    code: string
    symbol: string
    short_desc: string
    long_desc: string
    images: [Image]
    audio: string
    "3d_render": string
}

interface Location {
    id: string
    descriptor: Descriptor
    gps: string
    address: Address
    city: {
        name?: string
        code?: string
    }
    country: {
        name?: string
        code?: string //Country code as per ISO 3166-1 and ISO 3166-2 format
    }
    circle: {
        gps: string
        radius: Scalar
    }
    polygon: string
    "3dspace": string
}

interface Address {
    door: string
    name: string
    building: string
    street: string
    locality: string
    ward: string
    city: string
    state: string
    country: string
    area_code: string
}

interface Scalar {
    type?: "CONSTANT" | "VARIABLE"
    value: number
    estimated_value?: number
    computed_value?: number
    range?: {
        min: number
        max: number
    }
    unit: string
}

interface FulfillmentForIntent {
    id: string
    start: {
        location: Location
        time: Time
    }
    end: {
        location: Location
        time: Time
    }
    tags: Tags
}

interface State {
    descriptor: Descriptor
    updated_at: string
    updated_by: string
}

interface Person {
    name: Name
    image: Image
    dob: string
    gender: string
    cred: string
    tags: Tags
}

interface Contact {
    phone: string
    email: string
}

type Image = string

interface Name {
    full: string
    additional_name: string
    family_name: string
    given_name: string
    call_sign: string
    honorific_prefix: string
    honorific_suffix: string
}

interface Vehicle {
    category: string
    capacity: number
    make: string
    model: string
    size: string
    variant: string
    color: string
    energy_type: string
    registration: string
}

interface Fulfillment {
    id: string
    type: string
    state: State
    tracking: boolean
    agent: Person & Contact
    vehicle: Vehicle
    start: {
        location: Location
        time: Time
        instructions: Descriptor
        contact: Contact
    }
    end: {
        location: Location
        time: Time
        instructions: Descriptor
        contact: Contact
    }
    purpose: string
    tags: Tags
}

interface Time {
    label: string
    timestamp: string
    duration: string //Describes duration as per ISO8601 format
    range: {
        start: string
        end: string
    }
    days: string //comma separated values representing days of the week
}

interface Payment {
    uri: string
    tl_method: "http/get" | "http/post"
    params: {
        transaction_id: string
        amount: string
        [additionalProp: string]: string
    }
    type: "ON-ORDER" | "PRE-FULFILLMENT" | "ON-FULFILLMENT" | "POST-FULFILLMENT"
    status: "PAID" | "NOT-PATD"
    time?: Time
}

interface Category {
    id: string
    parent_category_id?: string
    descriptor?: Descriptor
    time?: Time
    tags?: Tags
}

type Tags = {
    [additionalProp: string]: string
}

interface OfferForIntent {
    id: string
    descriptor: {
        name: string
    }
}

interface ItemForIntent {
    id: string
    descriptor: {
        name: string
        tags: Tags
    }
}

interface Intent {
    query_string: string
    provider: ProviderForIntent
    fulfillment: FulfillmentForIntent
    payment: Payment
    category: Category
    offer: OfferForIntent
    item: ItemForIntent
    purpose: string
    tags: Tags
}

interface BecknError {
    type: "CONTEXT-ERROR" | "CORE-ERROR" | "DOMAIN-ERROR" | "POLICY-ERROR" | "JSON-SCHEMA-ERROR"
    code: string
    path?: string
    message?: string
}

interface Offer {
    id: string
    descriptor: Descriptor
    location_ids: [string]
    category_ids: [string]
    item_ids: [string]
    time: Time
}

interface Provider {
    id: string
    descriptor: Descriptor
    time: Time
    locations: [Location]
    tags: Tags
}

interface ProviderCatalog {
    categories: [Category]
    fulfillments: [Fulfillment]
    payments: [Payment]
    locations: [Location & Time]
    offers: [Offer]
    items: [Item]
    exp: string
}

interface Item {
    id: string
    parent_item_id: string
    descriptor: Descriptor
    price: Price
    category_id: string
    location_id: string
    time: Time
    matched: boolean
    related: boolean
    recommended: boolean
    tags: Tags
}

interface Price extends MonetaryValue {
    estimated_value?: string
    computed_value?: string
    listed_value?: string
    offered_value?: string
    minimum_value?: string
    maximum_value?: string
}

interface MonetaryValue {
    currency: string
    value: string
}

interface Catalog {
    "bpp/descriptor": Descriptor
    "bpp/categories": [Category]
    "bpp/fulfillments": [Fulfillment]
    "bpp/payments": [Payment]
    "bpp/offers": [Offer]
    "bpp/providers": [Provider & ProviderCatalog]
    exp: string
}

export interface SearchObject {
    context: Context
    message: {
        intent: Intent
    }
}

export interface On_SearchObject {
    context: Context
    message: {
        catalog: Catalog
    }
    error: BecknError
}