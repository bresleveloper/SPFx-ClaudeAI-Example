# SharePoint REST API Knowledge Base for SPFx

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication & SPFx Context](#authentication--spfx-context)
3. [Critical API #1: Fields Endpoint](#critical-api-1-fields-endpoint)
4. [Critical API #2: Items Endpoint](#critical-api-2-items-endpoint)
5. [OData Query Operations](#odata-query-operations)
6. [Special Field Types](#special-field-types)
7. [Field Name Properties](#field-name-properties)
8. [Pagination Best Practices](#pagination-best-practices)
9. [Error Handling](#error-handling)
10. [Code Examples](#code-examples)
11. [Headers & OData Versions](#headers--odata-versions)
12. [Common Pitfalls & Limitations](#common-pitfalls--limitations)

---

## Introduction

SharePoint REST API provides a powerful interface for interacting with SharePoint lists, libraries, and other resources. When used within SharePoint Framework (SPFx), you gain access to authenticated HTTP clients that simplify API calls without requiring manual OAuth implementation.

### Base URL Pattern
```
https://{site_url}/_api/web/...
```

### Key Principles
- All REST API requests use standard HTTP verbs (GET, POST, PATCH, DELETE)
- Responses are returned in JSON format (OData)
- SPFx provides built-in HTTP clients with automatic authentication
- Internal field names must be used in all queries

---

## Authentication & SPFx Context

### SPFx HTTP Clients

SharePoint Framework provides several HTTP client classes for different scenarios:

#### **SPHttpClient** (Most Common)
- Used for SharePoint REST API calls
- Automatically handles authentication to SharePoint
- Ready-to-use instance available on web part/extension context

```typescript
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

// Available via context
this.context.spHttpClient
```

#### **AadHttpClient**
- For Entra ID (Azure AD) secured resources
- Recommended for external APIs protected by Azure AD

#### **MSGraphClientV3**
- For Microsoft Graph operations
- Automatic authentication handling

### Context Object

The SPFx context provides essential information:

```typescript
// Site URL
this.context.pageContext.web.absoluteUrl

// Web part context
this.context.spHttpClient
```

### Authentication Tokens

SPFx leverages the SharePoint Online Client Extensibility service principal to obtain access tokens automatically. Developers can provide the current user's access token from SharePoint Context as Authorization Bearer in custom scenarios.

---

## Critical API #1: Fields Endpoint

### Endpoint
```
GET https://{site_url}/_api/web/lists/GetByTitle('{list_title}')/Fields
```

### Purpose
Retrieves all fields (columns) defined in a SharePoint list, including their metadata, properties, and configuration.

### Alternative Endpoints
```
GET /_api/web/fields('<field_id>')
GET /_api/web/lists(guid'<list_id>')/fields('<field_id>')
GET /_api/web/lists/GetByTitle('{list_title}')/Fields('<field_id>')
```

### Field Metadata Properties

When you retrieve fields, each field object contains numerous properties:

**Common Properties:**
- `Id` - Unique identifier (GUID)
- `InternalName` - Unique internal name (unchangeable)
- `Title` - Display name (user-visible)
- `StaticName` - Similar to InternalName
- `EntityPropertyName` - OData property name
- `TypeAsString` - Field type (e.g., "Text", "Number", "Choice")
- `FieldTypeKind` - Numeric field type identifier
- `Description` - Field description
- `Required` - Boolean, is field required
- `EnforceUniqueValues` - Boolean, must values be unique
- `Hidden` - Boolean, is field hidden
- `ReadOnlyField` - Boolean, is field read-only
- `Indexed` - Boolean, is field indexed
- `DefaultValue` - Default value for new items
- `Group` - Field group name
- `SchemaXml` - Complete field schema in XML format
- `CanBeDeleted` - Boolean, can field be deleted
- `Filterable` - Boolean, can be used in filters
- `FromBaseType` - Boolean, inherited from base type

**Specific Field Type Properties:**
- Choice fields: `Choices` array
- Lookup fields: `LookupList`, `LookupField`
- Calculated fields: `Formula`
- Number fields: `MinimumValue`, `MaximumValue`

### Example: Get All Fields
```typescript
const fieldsEndpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MyList')/Fields`;

this.context.spHttpClient.get(
  fieldsEndpoint,
  SPHttpClient.configurations.v1
)
.then((response: SPHttpClientResponse) => {
  return response.json();
})
.then((data) => {
  console.log('Fields:', data.value);
});
```

### Example: Filter Non-Hidden Fields
```typescript
const fieldsEndpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MyList')/Fields?$filter=Hidden eq false`;
```

### Example: Select Specific Field Properties
```typescript
const fieldsEndpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('MyList')/Fields?$select=InternalName,Title,TypeAsString,Required`;
```

### Creating Fields via REST

Fields can be created using the `createfieldasxml` method:

```typescript
// POST /_api/web/lists/GetByTitle('ListName')/fields
// Content-Type: application/json;odata=verbose

{
  "__metadata": { "type": "SP.Field" },
  "Title": "NewField",
  "FieldTypeKind": 2, // Text = 2
  "Required": false
}
```

### Field Type Values (FieldTypeKind)

Common field type enumeration values:
- Text: 2
- Number: 9
- DateTime: 4
- Boolean: 8
- Choice: 6
- Lookup: 7
- User: 20
- URL: 11
- MultiChoice: 15

---

## Critical API #2: Items Endpoint

### Endpoint
```
GET https://{site_url}/_api/web/lists/GetByTitle('{list_title}')/items
```

### Purpose
Retrieves items (rows) from a SharePoint list with support for filtering, selecting, expanding, sorting, and pagination.

### Basic Request
```typescript
const itemsEndpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Employees')/items`;

this.context.spHttpClient.get(
  itemsEndpoint,
  SPHttpClient.configurations.v1
)
.then((response: SPHttpClientResponse) => {
  return response.json();
})
.then((data) => {
  console.log('Items:', data.value);
});
```

### Response Structure
```json
{
  "odata.metadata": "https://site/_api/$metadata#SP.ListData.EmployeesListItems",
  "value": [
    {
      "odata.type": "SP.Data.EmployeesListItem",
      "odata.id": "...",
      "odata.editLink": "...",
      "Id": 1,
      "Title": "John Doe",
      "Email": "john@example.com"
    }
  ]
}
```

### Item Operations

#### GET - Retrieve Items
```
GET /_api/web/lists/GetByTitle('ListName')/items
```

#### GET - Single Item by ID
```
GET /_api/web/lists/GetByTitle('ListName')/items({itemId})
```

#### POST - Create Item
```typescript
const body = JSON.stringify({
  '__metadata': { 'type': 'SP.Data.ListNameListItem' },
  'Title': 'New Item'
});

const options: ISPHttpClientOptions = {
  headers: {
    'Accept': 'application/json;odata=nometadata',
    'Content-type': 'application/json;odata=nometadata',
    'odata-version': ''
  },
  body: body
};

this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, options);
```

#### PATCH/MERGE - Update Item
```typescript
const options: ISPHttpClientOptions = {
  headers: {
    'Accept': 'application/json;odata=nometadata',
    'Content-type': 'application/json;odata=nometadata',
    'odata-version': '',
    'IF-MATCH': '*',
    'X-HTTP-Method': 'MERGE'
  },
  body: JSON.stringify({
    'Title': 'Updated Title'
  })
};
```

#### DELETE - Delete Item
```typescript
const options: ISPHttpClientOptions = {
  headers: {
    'Accept': 'application/json;odata=nometadata',
    'Content-type': 'application/json;odata=nometadata',
    'odata-version': '',
    'IF-MATCH': '*',
    'X-HTTP-Method': 'DELETE'
  }
};
```

---

## OData Query Operations

### $select - Select Specific Fields

Returns only specified fields to reduce payload size and improve performance.

**Syntax:**
```
?$select=Field1,Field2,Field3
```

**Examples:**
```
/_api/web/lists/GetByTitle('Employees')/items?$select=ID,Title,Email

/_api/web/lists/GetByTitle('Employees')/items?$select=Title,Department/Title&$expand=Department
```

**Best Practice:** Always use $select to retrieve only required fields. Avoid returning all fields (*).

### $expand - Retrieve Lookup Values

Retrieves related data from lookup fields and person/group columns.

**Syntax:**
```
?$select=Field,LookupField/Property&$expand=LookupField
```

**Important:** Fields specified in $expand must also be included in $select.

**Examples:**

Lookup field:
```
/_api/web/lists/GetByTitle('Orders')/items?$select=Title,Customer/Title&$expand=Customer
```

Person/Group field:
```
/_api/web/lists/GetByTitle('Tasks')/items?$select=Title,AssignedTo/Title,AssignedTo/EMail&$expand=AssignedTo
```

Multiple fields:
```
/_api/web/lists/GetByTitle('Documents')/items?$select=Title,Author/Title,Editor/Title&$expand=Author,Editor
```

### $filter - Filter Results

Filters items based on specified conditions.

**Syntax:**
```
?$filter=(ColumnInternalName operator value)
```

**Operators:**
- `eq` - equals
- `ne` - not equals
- `gt` - greater than
- `ge` - greater than or equal
- `lt` - less than
- `le` - less than or equal
- `and` - logical AND
- `or` - logical OR
- `not` - logical NOT

**Functions:**
- `startswith(field, 'value')`
- `substringof('value', field)`
- `endswith(field, 'value')`

**Examples:**

Text field:
```
$filter=Title eq 'John Doe'
$filter=startswith(Title,'J')
```

Number field:
```
$filter=ID eq 5
$filter=Age gt 21
```

Boolean field:
```
$filter=IsActive eq true
```

Date field:
```
$filter=Created ge datetime'2024-01-01T00:00:00Z'
$filter=Modified le datetime'2024-12-31T23:59:59Z'
```

Multiple conditions:
```
$filter=(Department eq 'IT') and (Status eq 'Active')
$filter=(Age gt 18) or (HasPermission eq true)
```

Lookup/Person field:
```
$filter=AssignedTo/Title eq 'John Doe'
$filter=Department/ID eq 5
```
(Note: Must also use $expand for lookup fields)

### $orderby - Sort Results

Sorts results by one or more fields.

**Syntax:**
```
?$orderby=Field1 asc,Field2 desc
```

**Examples:**
```
$orderby=Title asc
$orderby=Created desc
$orderby=Department asc,Title asc
```

### $top - Limit Results

Returns only the top N items.

**Syntax:**
```
?$top=N
```

**Examples:**
```
$top=10          // First 10 items
$top=100         // First 100 items
```

**Important:** Maximum of 5000 items per request. For more, use pagination.

### $skiptoken - Pagination

Used for pagination (NOT $skip, which doesn't work for list items).

**Syntax:**
```
$skiptoken=Paged=TRUE&p_ID={lastItemId}
```

**Example:**
```
/_api/web/lists/GetByTitle('LargeList')/items?$top=100&$skiptoken=Paged=TRUE&p_ID=100
```

See [Pagination Best Practices](#pagination-best-practices) section for detailed implementation.

### Combining Query Options

Multiple query options can be combined using `&`:

```
/_api/web/lists/GetByTitle('Employees')/items
  ?$select=ID,Title,Department/Title,AssignedTo/Title
  &$expand=Department,AssignedTo
  &$filter=(Department/Title eq 'IT') and (Status eq 'Active')
  &$orderby=Title asc
  &$top=50
```

### Official Documentation

For complete OData query operation reference:
https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/use-odata-query-operations-in-sharepoint-rest-requests

---

## Special Field Types

### Lookup Fields

Lookup fields reference items in another list. By default, only the lookup ID is returned.

**Basic Lookup (ID only):**
```json
{
  "CustomerID": 5
}
```

**Expanded Lookup (with values):**
```
$select=Title,Customer/Title,Customer/ID&$expand=Customer
```

**Result:**
```json
{
  "Title": "Order 123",
  "Customer": {
    "ID": 5,
    "Title": "Acme Corp"
  }
}
```

**Filtering by Lookup:**
```
$filter=Customer/Title eq 'Acme Corp'&$expand=Customer
```

**Multiple Lookup Columns:**
```
$select=Title,Category/Title,SubCategory/Title&$expand=Category,SubCategory
```

### Person or Group Fields

Person/Group fields are internally lookup fields that reference the User Information List.

**Default (ID only):**
```json
{
  "AssignedToId": 12
}
```

**Expanded (with user details):**
```
$select=Title,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Name&$expand=AssignedTo
```

**Available User Properties:**
- `ID`
- `Title` (display name)
- `Name` (account name)
- `EMail`
- `UserName`
- `FirstName`
- `LastName`
- `Department`
- `JobTitle`

**Example:**
```typescript
const url = `${siteUrl}/_api/web/lists/GetByTitle('Tasks')/items
  ?$select=Title,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Department
  &$expand=AssignedTo`;
```

**Filtering by Person:**
```
$filter=CreatedBy/Title eq 'John Doe'&$expand=CreatedBy
```

### Managed Metadata Fields

Managed metadata (taxonomy) fields require special handling.

**Basic Approach:**
```
$select=Title,TaxonomyField
```
Returns only the WssId (term ID).

**Getting Label:**
```
$select=Title,TaxonomyField/Label&$expand=TaxonomyField
```

**Alternative: Use RenderListDataAsStream**

For complex metadata scenarios, consider using:
```
POST /_api/web/lists/GetByTitle('ListName')/RenderListDataAsStream
```

This endpoint provides better support for managed metadata and lookup fields.

### Multi-Value Fields

**Multi-Choice Fields:**
```json
{
  "Hobbies": {
    "results": ["Reading", "Traveling", "Cooking"]
  }
}
```

**Multi-Lookup Fields:**
```
$select=Title,CategoriesId&$expand=Categories
```

**Multi-Person Fields:**
```
$select=Title,TeamMembersId&$expand=TeamMembers
```

---

## Field Name Properties

Understanding the different field name properties is critical for working with SharePoint REST API.

### InternalName

- **Definition:** The unique, unchangeable name assigned when the field is created
- **Characteristics:**
  - No spaces (spaces become `_x0020_`)
  - Special characters are encoded
  - Cannot be changed after creation
  - Always unique within the list
- **Usage:** Required in all REST API queries

**Example:**
```
Display Name: "Start Date"
InternalName: "Start_x0020_Date"
```

### StaticName

- **Definition:** Typically the same as InternalName
- **Difference:** Can be explicitly set via CAML `StaticName` attribute
- **Usage:** Rare; mostly identical to InternalName

### EntityPropertyName

- **Definition:** The OData property name used in JSON responses
- **Rules:**
  - Usually same as InternalName
  - If field name starts with a number or special character → prefixed with `OData_`
  - For lookup fields → appends `Id` for the ID value

**Examples:**

Regular field:
```
InternalName: "EmployeeName"
EntityPropertyName: "EmployeeName"
```

Field starting with number:
```
InternalName: "123Field"
EntityPropertyName: "OData_123Field"
```

Lookup field:
```
InternalName: "Customer"
EntityPropertyName: "CustomerId" (for ID)
EntityPropertyName: "Customer" (for expanded object)
```

### Field Name Encoding

Special characters in field names are encoded:

| Character | Encoding |
|-----------|----------|
| Space     | `_x0020_` |
| #         | `_x0023_` |
| %         | `_x0025_` |
| &         | `_x0026_` |
| /         | `_x002f_` |

**Example:**
```
Display Name: "Employee #"
InternalName: "Employee_x0020__x0023_"
```

### Best Practices

1. **Always use InternalName** in REST queries ($select, $filter, $orderby)
2. **Avoid special characters** when creating fields
3. **Use camelCase or PascalCase** for new field names to avoid encoding
4. **Retrieve field metadata first** to identify correct InternalName:
   ```typescript
   /_api/web/lists/GetByTitle('MyList')/Fields?$select=Title,InternalName
   ```

### Finding Internal Names

**Method 1: REST API**
```
GET /_api/web/lists/GetByTitle('ListName')/Fields?$select=Title,InternalName,EntityPropertyName
```

**Method 2: List Settings**
1. Navigate to List Settings
2. Click on a column
3. Look at URL: `Field=InternalName`

**Method 3: Browser Developer Tools**
Inspect network responses to see actual property names used.

---

## Pagination Best Practices

### Critical: $skip Does NOT Work for List Items

**Important:** The `$skip` operator is NOT supported for SharePoint list items. It only works for lists themselves, not list items.

### Use $skiptoken Instead

The proper way to paginate list items is using `$skiptoken`.

**Syntax:**
```
$skiptoken=Paged=TRUE&p_ID={lastItemId}
```

### Pagination Pattern

**Step 1: Initial Request**
```
GET /_api/web/lists/GetByTitle('LargeList')/items?$top=100
```

**Step 2: Next Page**

From the first response, get the last item's ID (e.g., ID = 100):
```
GET /_api/web/lists/GetByTitle('LargeList')/items?$top=100&$skiptoken=Paged=TRUE&p_ID=100
```

**Step 3: Subsequent Pages**

Continue using the last item ID from each response.

### Pagination with Ordering

SharePoint REST API adds implicit ordering by ID. For custom ordering:

```
$orderby=Created desc&$top=100&$skiptoken=Paged=TRUE&p_ID=100
```

### Next Link in Response

SharePoint includes a `__next` property in responses when more items exist:

```json
{
  "odata.metadata": "...",
  "value": [...],
  "odata.nextLink": "https://site/_api/web/lists/GetByTitle('List')/items?$skiptoken=..."
}
```

**Usage:**
```typescript
this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
  .then((response: SPHttpClientResponse) => response.json())
  .then((data) => {
    const items = data.value;
    const nextLink = data['odata.nextLink'];

    if (nextLink) {
      // More items available - use nextLink for next request
    }
  });
```

### Maximum Items Limit

**Critical Limitation:** You cannot return more than 5000 items in a single request.

For lists with >5000 items:
- Use pagination
- Filter to reduce result set
- Consider indexed columns for better performance

### UI Pagination Pattern

**Next/Previous Only:**

Best practice: Only implement "Next" and "Previous" buttons. $skiptoken doesn't support arbitrary page numbers.

```typescript
interface PaginationState {
  pageTokens: string[];  // Stack of page tokens
  currentPage: number;
}

// Next page
const nextToken = getLastItemId(currentItems);
navigateToPage(`?$top=50&$skiptoken=Paged=TRUE&p_ID=${nextToken}`);

// Previous page
navigateToPage(pageTokens[currentPage - 1]);
```

### Server-Side Pagination

For large lists, always use server-side pagination rather than fetching all items:

```typescript
async getAllItems(): Promise<any[]> {
  let allItems: any[] = [];
  let nextUrl = `${siteUrl}/_api/web/lists/GetByTitle('LargeList')/items?$top=1000`;

  while (nextUrl) {
    const response = await this.context.spHttpClient.get(
      nextUrl,
      SPHttpClient.configurations.v1
    );
    const data = await response.json();

    allItems = allItems.concat(data.value);
    nextUrl = data['odata.nextLink'] || null;
  }

  return allItems;
}
```

### Performance Tips

1. **Use $top wisely:** Balance between fewer requests (larger $top) and response time
2. **Select only needed fields:** Use $select to reduce payload
3. **Filter when possible:** Reduce total items with $filter
4. **Index columns:** Ensure filtered/sorted columns are indexed
5. **Avoid large page sizes:** 100-500 items per page is optimal

---

## Error Handling

### Response Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Item created successfully |
| 204 | No Content | Update/delete successful |
| 400 | Bad Request | Invalid query syntax or parameters |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | List or item doesn't exist |
| 500 | Internal Server Error | Server-side error |

### Checking Response Status

```typescript
this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
  .then((response: SPHttpClientResponse) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }
  })
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

### Error Response Structure

SharePoint error responses typically contain:

```json
{
  "odata.error": {
    "code": "-1, Microsoft.SharePoint.Client.InvalidOperationException",
    "message": {
      "lang": "en-US",
      "value": "List 'InvalidList' does not exist..."
    }
  }
}
```

**Accessing Error Messages:**
```typescript
.catch(async (response: SPHttpClientResponse) => {
  const errorData = await response.json();
  const errorMessage = errorData?.error?.message?.value ||
                       errorData?.['odata.error']?.message?.value ||
                       'Unknown error';
  console.error('Error:', errorMessage);
});
```

### Common Errors

#### 1. List Not Found (404)
```
Error: List 'MyList' does not exist at site...
```

**Causes:**
- Incorrect list title (case-sensitive)
- List doesn't exist
- Insufficient permissions

**Fix:**
```typescript
// Verify list exists
GET /_api/web/lists?$filter=Title eq 'MyList'
```

#### 2. Field Not Found
```
Error: The field 'FieldName' does not exist...
```

**Causes:**
- Using Display Name instead of InternalName
- Typo in field name
- Field doesn't exist

**Fix:**
```typescript
// Get all field names
GET /_api/web/lists/GetByTitle('MyList')/Fields?$select=Title,InternalName
```

#### 3. Invalid $expand
```
Error: The query to field 'Field' is not valid...
```

**Causes:**
- Expanding a non-lookup field
- Missing field in $select
- Incorrect syntax

**Fix:**
```typescript
// Ensure field is in both $select and $expand
?$select=Title,LookupField/Title&$expand=LookupField
```

#### 4. CORS Errors (External APIs)
```
Error: No 'Access-Control-Allow-Origin' header...
```

**Cause:** Calling external API directly from SPFx

**Fix:** Use Azure Function as proxy or AadHttpClient for Azure AD-secured APIs

#### 5. Invalid Accept Header
```
Error: The HTTP header ACCEPT is missing or its value is invalid
```

**Cause:** Using wrong OData version syntax

**Fix:** See [Headers & OData Versions](#headers--odata-versions)

### Using Async/Await for Better Error Handling

```typescript
async getListItems(): Promise<any[]> {
  try {
    const response = await this.context.spHttpClient.get(
      `${siteUrl}/_api/web/lists/GetByTitle('MyList')/items`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message?.value || 'Request failed');
    }

    const data = await response.json();
    return data.value;

  } catch (error) {
    console.error('Failed to get list items:', error);
    throw error;
  }
}
```

### Debugging Tips

1. **Check Network Tab:** Inspect actual request URL and response in browser DevTools
2. **Test in Browser:** Navigate to REST endpoint directly to see raw response
3. **Verify Permissions:** Ensure current user has access to list/items
4. **Use Try/Catch:** Always wrap REST calls in error handling
5. **Log Responses:** Log full response objects during development
6. **Check Field Names:** Verify InternalName vs Display Name
7. **Test Incrementally:** Start with basic query, then add filters/expands

---

## Code Examples

### Complete GET Items Example

```typescript
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default class MyWebPart extends BaseClientSideWebPart<IMyWebPartProps> {

  private async getEmployees(): Promise<any[]> {
    const listName = 'Employees';
    const select = '$select=ID,Title,Email,Department/Title,Manager/Title';
    const expand = '$expand=Department,Manager';
    const filter = '$filter=Status eq \'Active\'';
    const orderby = '$orderby=Title asc';
    const top = '$top=50';

    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items?${select}&${expand}&${filter}&${orderby}&${top}`;

    try {
      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.value;

    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }
}
```

### Complete POST (Create Item) Example

```typescript
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

private async createEmployee(name: string, email: string, departmentId: number): Promise<number> {
  const listName = 'Employees';
  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items`;

  const itemData = {
    'Title': name,
    'Email': email,
    'DepartmentId': departmentId  // Lookup field - use InternalName + "Id"
  };

  const spHttpClientOptions: ISPHttpClientOptions = {
    headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-Type': 'application/json;odata=nometadata',
      'odata-version': ''
    },
    body: JSON.stringify(itemData)
  };

  try {
    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      spHttpClientOptions
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message?.value || 'Failed to create item');
    }

    const newItem = await response.json();
    console.log('Created item with ID:', newItem.Id);
    return newItem.Id;

  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}
```

### Complete PATCH (Update Item) Example

```typescript
private async updateEmployee(itemId: number, updates: any): Promise<void> {
  const listName = 'Employees';
  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items(${itemId})`;

  const spHttpClientOptions: ISPHttpClientOptions = {
    headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-Type': 'application/json;odata=nometadata',
      'odata-version': '',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    },
    body: JSON.stringify(updates)
  };

  try {
    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      spHttpClientOptions
    );

    if (!response.ok) {
      throw new Error(`Failed to update item: ${response.statusText}`);
    }

    console.log('Item updated successfully');

  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}
```

### Complete DELETE Example

```typescript
private async deleteEmployee(itemId: number): Promise<void> {
  const listName = 'Employees';
  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items(${itemId})`;

  const spHttpClientOptions: ISPHttpClientOptions = {
    headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-Type': 'application/json;odata=nometadata',
      'odata-version': '',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'DELETE'
    }
  };

  try {
    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      spHttpClientOptions
    );

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }

    console.log('Item deleted successfully');

  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}
```

### Get List Fields Example

```typescript
private async getListFields(listName: string): Promise<any[]> {
  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/Fields?$filter=Hidden eq false&$select=InternalName,Title,TypeAsString,Required`;

  try {
    const response = await this.context.spHttpClient.get(
      url,
      SPHttpClient.configurations.v1
    );

    const data = await response.json();
    return data.value;

  } catch (error) {
    console.error('Error fetching fields:', error);
    return [];
  }
}
```

### Pagination Example

```typescript
private async getAllItemsPaginated(listName: string): Promise<any[]> {
  let allItems: any[] = [];
  let nextUrl: string = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items?$top=1000&$select=ID,Title`;

  try {
    while (nextUrl) {
      const response = await this.context.spHttpClient.get(
        nextUrl,
        SPHttpClient.configurations.v1
      );

      const data = await response.json();
      allItems = allItems.concat(data.value);

      // Check for next page
      nextUrl = data['odata.nextLink'] || null;

      console.log(`Fetched ${allItems.length} items so far...`);
    }

    console.log(`Total items fetched: ${allItems.length}`);
    return allItems;

  } catch (error) {
    console.error('Error in pagination:', error);
    return allItems; // Return what we got so far
  }
}
```

### Batch Request Example

For multiple operations, consider batch requests:

```typescript
private async batchRequest(): Promise<void> {
  const batchUrl = `${this.context.pageContext.web.absoluteUrl}/_api/$batch`;
  const batchGuid = this.generateGuid();

  // Batch requests are complex - consider using PnPjs library
  // which provides easier batch request handling
}
```

**Recommendation:** For complex scenarios including batch requests, consider using [@pnp/sp](https://pnp.github.io/pnpjs/) library.

---

## Headers & OData Versions

### OData Version Differences

SharePoint REST API supports two OData protocol versions:

| Version | OData Value | Metadata Syntax | Default in SPFx |
|---------|-------------|-----------------|-----------------|
| v3 (Verbose) | 3.0 | `odata=verbose` | No |
| v4 (Minimal) | 4.0 | `odata.metadata=minimal` | Yes |

### Default SPHttpClient Behavior (OData v4)

By default, SPHttpClient uses OData v4:

```typescript
// Default headers (automatically applied)
{
  'odata-version': '4.0',
  'Accept': 'application/json;odata.metadata=minimal',
  'Content-Type': 'application/json;odata.metadata=minimal'
}
```

### Using OData v3 (Verbose Mode)

To use OData v3 verbose mode, explicitly set headers:

```typescript
const spHttpClientOptions: ISPHttpClientOptions = {
  headers: {
    'Accept': 'application/json;odata=verbose',
    'Content-Type': 'application/json;odata=verbose',
    'odata-version': '3.0'
  }
};

const response = await this.context.spHttpClient.get(
  url,
  SPHttpClient.configurations.v1,
  spHttpClientOptions
);
```

### Response Differences

**OData v4 (Default):**
```json
{
  "odata.metadata": "...",
  "value": [...]
}
```

**OData v3 (Verbose):**
```json
{
  "d": {
    "results": [...]
  }
}
```

### Common Header Configurations

#### GET Request Headers

**Minimal metadata (recommended):**
```typescript
{
  'Accept': 'application/json;odata=nometadata',
  'odata-version': ''
}
```

**No metadata:**
```typescript
{
  'Accept': 'application/json;odata=nometadata',
  'Content-Type': 'application/json;odata=nometadata',
  'odata-version': ''
}
```

**Verbose mode:**
```typescript
{
  'Accept': 'application/json;odata=verbose',
  'odata-version': '3.0'
}
```

#### POST/PATCH/DELETE Headers

**Create item:**
```typescript
{
  'Accept': 'application/json;odata=nometadata',
  'Content-Type': 'application/json;odata=nometadata',
  'odata-version': ''
}
```

**Update item:**
```typescript
{
  'Accept': 'application/json;odata=nometadata',
  'Content-Type': 'application/json;odata=nometadata',
  'odata-version': '',
  'IF-MATCH': '*',               // or specific ETag
  'X-HTTP-Method': 'MERGE'       // or 'PATCH'
}
```

**Delete item:**
```typescript
{
  'Accept': 'application/json;odata=nometadata',
  'Content-Type': 'application/json;odata=nometadata',
  'odata-version': '',
  'IF-MATCH': '*',
  'X-HTTP-Method': 'DELETE'
}
```

### IF-MATCH Header

Used for update and delete operations to prevent conflicts:

- `'*'` - Always update/delete (ignore version conflicts)
- `'{etag}'` - Update/delete only if version matches

**Getting ETag:**
```typescript
const response = await this.context.spHttpClient.get(
  `${url}/items(${itemId})`,
  SPHttpClient.configurations.v1
);

const etag = response.headers.get('ETag');
```

### X-HTTP-Method Header

SharePoint uses POST for updates and deletes with special header:

- `'MERGE'` - Update (only specified fields)
- `'PATCH'` - Update (alternative to MERGE)
- `'DELETE'` - Delete item

### Common Header Errors

**Error:** "The HTTP header ACCEPT is missing or its value is invalid"

**Cause:** Using `odata` instead of `odata.metadata` in OData v4

**Fix:**
```typescript
// Wrong
'Accept': 'application/json;odata=minimal'

// Correct (v4)
'Accept': 'application/json;odata.metadata=minimal'

// OR use v3
'Accept': 'application/json;odata=verbose'
'odata-version': '3.0'
```

### SPHttpClient Configurations

SPFx provides predefined configurations:

```typescript
SPHttpClient.configurations.v1  // Recommended
SPHttpClient.configurations.v2  // Alternative
```

These configurations automatically handle many headers. For custom control, use `ISPHttpClientOptions`.

---

## Common Pitfalls & Limitations

### 1. $skip Not Supported for List Items

**Problem:** Using `$skip` for pagination

**Fix:** Use `$skiptoken` instead

See: [Pagination Best Practices](#pagination-best-practices)

### 2. 5000 Item Threshold

**Problem:** Lists with >5000 items may return errors or incomplete results

**Fixes:**
- Use indexed columns for filtering
- Implement pagination
- Filter to reduce result set below threshold
- Consider list archival for very large lists

### 3. Display Name vs Internal Name

**Problem:** Using display name in queries

**Fix:** Always use InternalName:
```typescript
// Wrong
$select=Start Date

// Correct
$select=Start_x0020_Date
```

### 4. Missing $expand with Lookup Fields

**Problem:** Lookup field returns only ID

**Fix:** Include field in both $select and $expand:
```typescript
$select=Title,Customer/Title&$expand=Customer
```

### 5. Case Sensitivity

**Problem:** List titles and field names are case-sensitive

**Fix:** Use exact casing:
```typescript
// Wrong
GetByTitle('employees')

// Correct (if list is titled "Employees")
GetByTitle('Employees')
```

### 6. Special Characters in Field Names

**Problem:** Fields with spaces/special characters

**Fix:** Use encoded InternalName:
```typescript
// Display: "Employee #1"
// Use: Employee_x0020__x0023_1
```

### 7. Metadata Type for POST/PATCH

**Problem:** Creating/updating items without correct metadata type

**Fix:** Include `__metadata` with correct type:
```typescript
{
  '__metadata': { 'type': 'SP.Data.ListNameListItem' },
  'Title': 'Value'
}
```

Type format: `SP.Data.{ListName}ListItem`
(Remove spaces, add "ListItem" suffix)

### 8. CORS Errors with External APIs

**Problem:** Cannot call external APIs directly from SPFx

**Fixes:**
- Use AadHttpClient for Azure AD-secured APIs
- Create Azure Function proxy
- Use Microsoft Graph instead when possible

### 9. Lookup Field Updates

**Problem:** Updating lookup field incorrectly

**Fix:** Use InternalName + "Id":
```typescript
{
  'CustomerId': 5  // Not 'Customer': 5
}
```

### 10. Person Field in Filters

**Problem:** Filtering by user name incorrectly

**Fix:** Expand and use proper property:
```typescript
$filter=AssignedTo/Title eq 'John Doe'&$expand=AssignedTo
// or
$filter=AssignedToId eq 12
```

### 11. Excessive Data Retrieval

**Problem:** Fetching all fields and all items

**Fixes:**
- Use $select for specific fields
- Use $top to limit results
- Implement pagination
- Filter unnecessary items

### 12. Hardcoded Site URLs

**Problem:** Using hardcoded URLs instead of context

**Fix:** Use context:
```typescript
// Wrong
const url = 'https://contoso.sharepoint.com/sites/mysite/_api/...';

// Correct
const url = `${this.context.pageContext.web.absoluteUrl}/_api/...`;
```

### 13. Not Handling Async Properly

**Problem:** Not waiting for promises to resolve

**Fix:** Use async/await or proper promise chains:
```typescript
// Wrong
const data = this.getData();  // Returns Promise, not data

// Correct
const data = await this.getData();
```

### 14. Insufficient Error Handling

**Problem:** No error handling for REST calls

**Fix:** Always use try/catch or .catch():
```typescript
try {
  const response = await this.context.spHttpClient.get(url, config);
  // handle response
} catch (error) {
  console.error('Error:', error);
  // handle error
}
```

### 15. Performance Issues

**Common causes:**
- Fetching too many items at once
- Not using indexed columns
- Multiple sequential requests instead of batch
- Retrieving all fields unnecessarily

**Fixes:**
- Implement pagination
- Index filtered/sorted columns
- Use batch requests for multiple operations
- Use $select to limit fields

### 16. Authentication Issues

**Problem:** 401 or 403 errors

**Causes:**
- User lacks permissions
- Using wrong authentication context
- Session expired

**Fixes:**
- Verify user permissions in SharePoint
- Use correct SPHttpClient from context
- Check API permissions in SharePoint Admin

### 17. List Doesn't Exist in Subsite

**Problem:** Trying to access list that exists in root site from subsite

**Fix:** Use absolute URL to root site or correct site:
```typescript
const url = `https://tenant.sharepoint.com/sites/root/_api/web/lists/GetByTitle('List')/items`;
```

### 18. Multi-Value Field Updates

**Problem:** Updating multi-choice or multi-lookup incorrectly

**Fix:** Use `results` array:
```typescript
{
  'CategoriesId': { 'results': [1, 3, 5] }  // For multi-lookup
}
```

---

## Additional Resources

### Official Microsoft Documentation

- **SharePoint REST API Overview:**
  https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service

- **Working with Lists and List Items:**
  https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/working-with-lists-and-list-items-with-rest

- **OData Query Operations:**
  https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/use-odata-query-operations-in-sharepoint-rest-requests

- **Fields REST API Reference:**
  https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-rest-reference/dn600182(v=office.15)

- **Connect to SharePoint APIs in SPFx:**
  https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint

- **SPHttpClient API Reference:**
  https://learn.microsoft.com/en-us/javascript/api/sp-http-base/sphttpclient

### Community Resources

- **PnP SharePoint Framework Samples:**
  https://github.com/pnp/sp-dev-fx-webparts

- **PnPjs Library (Recommended for Complex Scenarios):**
  https://pnp.github.io/pnpjs/

- **SharePoint REST API Explorer:**
  https://s-kainet.github.io/sp-rest-explorer/

### Training Materials

- **Microsoft Learn - SPFx Training:**
  https://github.com/SharePoint/sp-dev-training-spfx-spcontent

---

## Summary

This knowledge base covers the essential aspects of working with SharePoint REST API in SPFx, with particular focus on the two critical endpoints:

1. **Fields API**: `/_api/web/lists/GetByTitle('{list_title}')/Fields`
   - Retrieve list field metadata
   - Understand field properties and types
   - Navigate InternalName vs DisplayName

2. **Items API**: `/_api/web/lists/GetByTitle('{list_title}')/items`
   - CRUD operations on list items
   - OData query operations ($select, $expand, $filter, etc.)
   - Pagination with $skiptoken
   - Handling lookup and person fields

### Key Takeaways

- ✅ Use SPHttpClient from SPFx context for automatic authentication
- ✅ Always use InternalName for field references
- ✅ Use $select to retrieve only needed fields
- ✅ Use $skiptoken (not $skip) for pagination
- ✅ Expand lookup fields with both $select and $expand
- ✅ Implement proper error handling
- ✅ Be aware of 5000 item threshold
- ✅ Use appropriate OData version headers

This knowledge base should serve as a comprehensive reference for AI code assistants working with SharePoint Framework and REST API operations.
